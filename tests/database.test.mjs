import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { createSeedData } from "../src/services/seed.ts";

test("SQL migration, test access, transactional edits and relational constraints", async () => {
  const db = new PGlite();
  try {
    await db.exec("create role anon; create role authenticated;");
    await db.exec(
      readFileSync(
        new URL(
          "../supabase/migrations/202609300001_puls.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    await db.exec(
      readFileSync(new URL("../supabase/seed.sql", import.meta.url), "utf8"),
    );
    assert.equal(
      (await db.query("select count(*)::int as n from public.projects")).rows[0]
        .n,
      24,
    );
    await db.exec("set role anon");
    await assert.rejects(
      db.query("select * from public.projects"),
      /permission denied/,
    );
    await assert.rejects(
      db.query("select public.save_project('{}'::jsonb)"),
      /permission denied/,
    );
    await db.exec("reset role");
    await db.exec(
      readFileSync(
        new URL("../supabase/development-access.sql", import.meta.url),
        "utf8",
      ),
    );
    await db.exec("set role anon");
    const data = createSeedData();
    const project = data.projects[0];
    const people = data.project_people.filter(
      (p) => p.project_id === project.id,
    );
    const draft = {
      project: {
        ...project,
        name: "Ändrat projekt",
        comment: "Sparad kommentar",
      },
      people,
      allocations: data.allocations.filter((a) =>
        people.some((p) => p.id === a.project_person_id),
      ),
      levelIds: [data.project_levels[0].id, data.project_levels[1].id],
    };
    draft.allocations[0].percentage = 150;
    const save = (d) =>
      db.query("select public.save_project($1::jsonb)", [JSON.stringify(d)]);
    await save(draft);
    const persisted = (
      await db.query("select * from public.projects where id=$1", [project.id])
    ).rows[0];
    assert.equal(persisted.name, "Ändrat projekt");
    assert.equal(persisted.comment, "Sparad kommentar");
    assert.equal(
      Number(
        (
          await db.query(
            "select percentage from public.allocations where id=$1",
            [draft.allocations[0].id],
          )
        ).rows[0].percentage,
      ),
      150,
    );
    assert.equal(
      (
        await db.query(
          "select count(*)::int as n from public.project_level_links where project_id=$1",
          [project.id],
        )
      ).rows[0].n,
      2,
    );
    await assert.rejects(save(draft), /ändrats/);
    draft.project.updated_at = persisted.updated_at.toISOString();
    // Preserve timestamp precision for the concurrency token (PostgREST returns a string).
    draft.project.updated_at = (
      await db.query(
        "select updated_at::text as token from public.projects where id=$1",
        [project.id],
      )
    ).rows[0].token;
    draft.project.name = "Must roll back";
    draft.allocations[0].end_date = "2025-01-01";
    await assert.rejects(save(draft), /check constraint/);
    assert.equal(
      (
        await db.query("select name from public.projects where id=$1", [
          project.id,
        ])
      ).rows[0].name,
      "Ändrat projekt",
    );
    draft.allocations[0].end_date = "2026-12-31";
    draft.project.name = "Ändrat igen";
    draft.people = draft.people.filter((p) => p.role !== "consultant");
    draft.allocations = draft.allocations.filter((a) =>
      draft.people.some((p) => p.id === a.project_person_id),
    );
    await save(draft);
    assert.equal(
      (
        await db.query(
          "select count(*)::int as n from public.project_people where project_id=$1",
          [project.id],
        )
      ).rows[0].n,
      1,
    );
    await db.query("update public.projects set archived=true where id=$1", [
      project.id,
    ]);
    assert.equal(
      (
        await db.query("select archived from public.projects where id=$1", [
          project.id,
        ])
      ).rows[0].archived,
      true,
    );
    await assert.rejects(
      db.query("delete from public.properties"),
      /permission denied/,
    );
    await assert.rejects(
      db.query("delete from public.people where id=$1", [data.people[0].id]),
      /foreign key constraint/,
    );
  } finally {
    await db.close();
  }
});
