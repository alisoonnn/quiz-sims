// importation des hooks react
// use effect pour exécuter code après rendu composant
// use state pour ajouter état local dans le composant fonctionnel
import { useEffect, useState } from 'react'

// declaration composant fonctionnel Quiz
const Quiz = () => {
    // les questions chargés depuis fichier Json
    // le premier stocke les questions
    // set ... -> fonction pour mettre à jour
    const [questionsData, setQuestionsData] = useState([]);
    // état pour récupérer la question actuelle
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    // état pour déterminage affichage de la div réponse
    const [showAnswer, setShowAnswer] = useState(false)
    // option sélectionné par l'utilisateur
    const [selectedOption, setSelectedOption] = useState('');
    // état pour vérifié validation de la réponse par utilisateur
    const [isAnswerValidated, setIsAnswerValidated] = useState(false);
    // score
    const [score, setScore] = useState(0);
    // état vérification de si quizz terminé
    const [quizCompleted, setQuizCompleted] = useState(false);


    // charge les questions depuis le fichier json
    useEffect(() => {
        // récupérer le fichier json avec fetch
        fetch('/questions.json')

        // conversion réponse en format json
            .then((response) => response.json())

        // mis à jour état questions avec les données récupérées
            .then((data) => setQuestionsData(data))

        // pour capturer éventuels erreurs
            .catch((error) => console.error('Error loading questions:', error));
    }, []);

    // extrait question actuelle
    // accède à la bonne en utilisant questionsData
    const currentQuestion = questionsData[currentQuestionIndex];

    // fonction va être appelée lors du click sur 'valider'
    const handleShowAnswer = () => {
        // mise à jour de ShowAnswer
        setShowAnswer(true)
        // mise à jour de isAnswerValidated
        setIsAnswerValidated(true);

        // condition pour incrémentation score
        // comparaison option sélectionné et la bonne réponse
        if (selectedOption === currentQuestion.answer) {
            setScore((prevScore) => prevScore + 1);
        }
    }

    // fonction pour passer à la question suivante 
    // va être appelé au click de 'question suivante'
    const handleNextQuestion = () => {
        // mis à jour showAnswer pour retirer la div
        setShowAnswer(false)
        // réinitialise l'état de IsAnswerValidated
        setIsAnswerValidated(false);
        
        // vérification de s'il y a encore des questions à afficher
        // si l'index de currentquestion est inférieur au tableau questionsData
        if (currentQuestionIndex + 1 < questionsData.length) {
            // passer à la question suivante
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
            // marque quiz comme terminé
            setQuizCompleted(true);
        }
    }

    // appelé lorsque option sélectionnée
    const handleOptionChange = (event) => {
        // mis à jour de selectedOption avec valeur de l'option sélectionnée
        setSelectedOption(event.target.value);
        // event -> objet évènement
        // event.target -> ref à l'élément dom déclenchant l'évènement
        // event.target.value -> accède valeur élément sélectionné
    };

    // mettre à jour option sélectionné lors du clic sur la div
    const handleOptionClick = (option) => {
        setSelectedOption(option);
    }

    // fonction qui va retourner la classe css à ajouter à une option
    const getOptionClass = (option) => {
        // vérifie si la réponse a été validé
        if (isAnswerValidated) {
            // si option validée est la bonne réponse
            if (option === currentQuestion.answer) {
                return 'correct';
            // si option est celle sélectionnée mais incorrect
            } else if (option === selectedOption) {
                return 'incorrect';
            }
        }
        else if (option === selectedOption) {
            return 'selected';
        }
        // chaîne vide si aucune condition remplie
        return '';
    };

    // si quiz  terminée
    if (quizCompleted) {
        // apparition d'une div avec le score et permettant de recommencer le quiz
        return (
            <div className='quiz-completed'>
                <img 
                className='perso'
                src='/img/sims4_perso.png'
                alt='Personnages sims 4'></img>
                <h1>Quiz terminé !</h1>
                <p>{score} / {questionsData.length}</p>
                <button onClick={() => window.location.reload()}>Recommencer</button>
            </div>
        );
    }

    
    // si quiz pas marqué comme terminé
    return (
        <div className='container'>
            <img
            className='logo-sims'
            src='/img/plumbob.png'
            alt='logo sims 4'
            />
            <h1>Quiz Les Sims 4</h1>
            
            {/* vérification de si currentQuestion existe */}
            {currentQuestion && (
                <div className='question'>
                    {/* affichage image */}
                    <img
                    className='img-question'
                    src={currentQuestion.image}
                    alt={`Image de la question ${currentQuestion.question}`}
                    />

                    {/* affichage question */}
                    <h2>{currentQuestion.question}</h2>
                    {/* affichage option sous radio button */}
                    <form>
                        {/* map -> boucle */}
                        {currentQuestion.options.map((option, index) => (
                            // utilisation d'une clé unique car pas d'id pour chaque option
                            <div
                                className={`cont-input ${getOptionClass(option)}`}
                                key={index}
                                onClick={() => handleOptionClick(option)}
                            >
                                <input
                                    type="radio"
                                    // clé unique
                                    id={`option-${index}`}
                                    name="quiz-option"
                                    value={option}
                                    checked={selectedOption === option}
                                    // fonction a appelé lorsque la valeur de l'élément change
                                    onChange={handleOptionChange}
                                    // désactiver options après validation
                                    disabled={isAnswerValidated} 
                                />
                                <label
                                    htmlFor={`option-${index}`}
                                    // classe css déterminé
                                    className={getOptionClass(option)}
                                >
                                    {option}
                                </label>
                            </div>
                        ))}
                    </form>

                    {/* - condition à partir de l'état showAnswer
                        - si réponse pas validée 
                        - opération ternaire */}
                    {!showAnswer ? (
                        // si vrai
                        <button className='valid-btn' onClick={handleShowAnswer}>Valider</button>
                    ) : (
                        // si faux
                        <div className='explanation'>
                            {/* afficher reponse correcte et explication */}
                            <p>{currentQuestion.explanation}</p>
                            {/* button question suivante */}
                            <button onClick={handleNextQuestion}>Question suivante</button>
                        </div>
                    )}
                </div>
                
            )}
        </div>
    );
};

// exportation composant
export default Quiz;