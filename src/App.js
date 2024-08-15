// App.js -> généralement composant racine d'application react, point d'entrée pour ui de l'app

import Quiz from './Quiz';
// importation du composant quiz


function App() {
  return (
    <div className='App'>
      {/* inclusion composant Quiz dans le rendu */}
       <Quiz />
    </div>
  );
}

// exportation composant
export default App
