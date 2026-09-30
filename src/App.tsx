import {
  Badge, Button, Card, CardContent, CardHeader, Dialog, DialogContent,
  DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Notice,
} from '@hufvudstaden/design-system';
import { supabaseConfig } from './lib/supabase';

export function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-6">
        <strong className="text-xl">Puls</strong>
        <Badge>Development</Badge>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-6 pb-16 pt-10">
        <p className="text-primary">Your new workspace</p>
        <h1>Welcome to Puls</h1>
        <p className="max-w-2xl">A starting point for your next application. Build your first feature with the shared components and your Supabase backend.</p>
        <div className="my-8">
          <Dialog>
            <DialogTrigger asChild><Button>Explore the starter</Button></DialogTrigger>
            <DialogContent closeLabel="Close">
              <DialogHeader>
                <DialogTitle>Ready for your first feature</DialogTitle>
                <DialogDescription>Edit src/App.tsx to start building Puls. Shared buttons, cards, forms and dialogs are available from the design system.</DialogDescription>
              </DialogHeader>
              <p>The project README explains local package updates and Supabase configuration.</p>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader><h2 className="mb-0">Shared design system</h2></CardHeader>
            <CardContent><p className="mb-0">Hufvudstaden components and theme are installed. Application layout uses Tailwind utilities.</p></CardContent>
          </Card>
          <Card>
            <CardHeader><h2 className="mb-0">Supabase backend</h2></CardHeader>
            <CardContent><p className="mb-0">{supabaseConfig.status === 'ready'
              ? 'Client configured. You can now add authentication and data queries. Connection and permissions have not been verified.'
              : 'The client is prepared. You can develop the interface while your backend is being configured.'}</p></CardContent>
          </Card>
        </div>
        {supabaseConfig.status !== 'ready' && (
          <Notice heading={supabaseConfig.status === 'missing' ? 'Connect Supabase when you are ready' : 'Check Supabase configuration'}>
            <p className="mb-0">{supabaseConfig.message}</p>
          </Notice>
        )}
      </main>
    </>
  );
}
