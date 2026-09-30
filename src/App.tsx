import hufvudstadenLogo from "@hufvudstaden/design-system/assets/hufvudstaden/logos/hufvudstaden-black.svg";
import { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Notice,
  Skeleton,
  Toaster,
  toast,
} from "@hufvudstaden/design-system";
import type { AppData } from "./domain/types";
import {
  archiveProject,
  isDemo,
  loadData,
  saveAdminValue,
  saveProject,
} from "./services/repository";
import { Planning } from "./features/Planning";
import { Projects } from "./features/Projects";
import { ProjectEditor } from "./features/ProjectEditor";
import { ProjectDetail } from "./features/ProjectDetail";
import { Resources } from "./features/Resources";
import { Administration } from "./features/Administration";

const pages = [
  { id: "planering", label: "Planering" },
  { id: "projekt", label: "Projekt" },
  { id: "resurser", label: "Resurser" },
  { id: "administration", label: "Administration" },
];
const currentPage = () =>
  pages.some((p) => p.id === location.hash.slice(1))
    ? location.hash.slice(1)
    : "planering";
export function App() {
  const [page, setPage] = useState(currentPage);
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ id?: string } | null>(null);
  const [person, setPerson] = useState("");
  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await loadData());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Data kunde inte hämtas.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void reload();
  }, [reload]);
  useEffect(() => {
    const update = () => {
      setPage(currentPage());
      setProjectId(null);
      setPerson("");
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  const mutate = async (action: () => Promise<void>, message: string) => {
    try {
      await action();
      try {
        setData(await loadData());
        setError("");
      } catch {
        setError(
          "Ändringen sparades, men vyn kunde inte uppdateras. Ladda om data innan du fortsätter.",
        );
      }
      toast({ title: message });
      return true;
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Kunde inte spara",
        description: e instanceof Error ? e.message : "Försök igen.",
      });
      return false;
    }
  };
  return (
    <>
      <a className="skip-link" href="#main">
        Hoppa till innehåll
      </a>
      <div className="app-shell">
        <aside className="app-sidebar">
          <a href="#planering" className="app-name">
            Puls
          </a>
          <p className="sidebar-caption">Resursplanering</p>
          <nav aria-label="Huvudnavigation">
            {pages.map((p, index) => (
              <a
                href={`#${p.id}`}
                aria-current={page === p.id ? "page" : undefined}
                key={p.id}
              >
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {p.label}
              </a>
            ))}
          </nav>
          <div className="sidebar-footer">
            <span>Planera med framförhållning.</span>
            <small>En gemensam bild av kapaciteten.</small>
          </div>
        </aside>
        <div className="app-body">
          <header className="app-header">
            <img
              src={hufvudstadenLogo}
              alt="Hufvudstaden"
              width={281}
              height={25}
              className="app-brand-logo"
            />
            <span>Arbetsyta / {pages.find((p) => p.id === page)?.label}</span>
            <Badge>{isDemo ? "Demoläge · testdata" : "Supabase"}</Badge>
          </header>
          <main id="main" tabIndex={-1}>
            {isDemo && (
              <div className="demo-banner" role="status">
                Demoläge med fiktiva testdata. Ändringar sparas endast i denna
                webbläsare. Supabase används när anslutningen är konfigurerad.
              </div>
            )}
            {error && (
              <Notice
                heading="Data kunde inte uppdateras"
                action={
                  <Button onClick={() => void reload()}>Försök igen</Button>
                }
              >
                <p role="alert">{error}</p>
                <p>
                  Kontrollera anslutningen och att databasens migration,
                  testbehörigheter och seeddata har lästs in.
                </p>
              </Notice>
            )}
            {loading ? (
              <div
                className="loading-state"
                aria-label="Laddar Puls"
                role="status"
              >
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-96 w-full" />
                <span className="sr-only">Laddar data…</span>
              </div>
            ) : (
              data &&
              !error && (
                <>
                  {page === "planering" && (
                    <Planning
                      key={person}
                      data={data}
                      initialPerson={person}
                      onProject={setProjectId}
                    />
                  )}
                  {page === "projekt" && (
                    <Projects
                      data={data}
                      onProject={setProjectId}
                      onCreate={() => setEditor({})}
                    />
                  )}
                  {page === "resurser" && (
                    <Resources
                      data={data}
                      onPerson={(id) => {
                        setPerson(id);
                        setPage("planering");
                        history.pushState(null, "", "#planering");
                      }}
                    />
                  )}
                  {page === "administration" && (
                    <Administration
                      data={data}
                      onSave={(table, value) =>
                        mutate(
                          () => saveAdminValue(table, value),
                          "Ändringen sparades",
                        )
                      }
                    />
                  )}
                </>
              )
            )}
          </main>
          <footer className="app-footer">
            Puls · Resursplanering <span>20 % ≈ 1 dag/vecka</span>
          </footer>
        </div>
      </div>
      {data && projectId && !editor && (
        <ProjectDetail
          id={projectId}
          data={data}
          onClose={() => setProjectId(null)}
          onEdit={() => setEditor({ id: projectId })}
          onArchive={(id, archived) =>
            mutate(
              () => archiveProject(id, archived),
              archived ? "Projektet arkiverades" : "Projektet återställdes",
            )
          }
        />
      )}
      {data && editor && (
        <ProjectEditor
          data={data}
          projectId={editor.id}
          onClose={() => setEditor(null)}
          onSave={(draft) =>
            mutate(() => saveProject(draft), "Projektet sparades")
          }
        />
      )}
      <Toaster />
    </>
  );
}
