// Demo obal okolo <Tour>. Na reálnom webe stačí vložiť samotný <Tour src=... />.
//
// EDIT režim je tu stav (nie reload): tlačidlo ho prepína bez obnovenia stránky.
// Počiatočná hodnota sa berie z ?edit=1, aby sa dal otvoriť rovno editor.
import { useState } from 'react';
import Tour from './tour/Tour.jsx';
import './App.css';

export default function App() {
  const params = new URLSearchParams(window.location.search);
  // relatívna cesta (bez "/") => funguje aj v podpriečinku na GitHub Pages
  const src = params.get('src') || 'tours/demo/tour.json';
  const [edit, setEdit] = useState(params.get('edit') === '1');

  function toggle() {
    const next = !edit;
    setEdit(next);
    // udrž URL v súlade (bez reloadu), nech sa dá refreshnúť/zdieľať
    const u = new URL(window.location.href);
    if (next) u.searchParams.set('edit', '1');
    else u.searchParams.delete('edit');
    window.history.replaceState(null, '', u);
  }

  return (
    <div className="demo">
      <div className="demo__stage">
        <Tour src={src} edit={edit} />
      </div>
      {/* Tlačidlo editora je viditeľné len počas vývoja (npm run dev).
          Na nasadenej "finálnej" prehliadke nie je — editor si aj tak
          kedykoľvek otvoríš ručne pridaním ?edit=1 do URL. */}
      {(import.meta.env.DEV || edit) && (
        <button type="button" className="demo__toggle" onClick={toggle}>
          {edit ? '← Späť do prehliadky' : 'EDIT režim →'}
        </button>
      )}
    </div>
  );
}
