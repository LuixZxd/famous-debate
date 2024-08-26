document.addEventListener('DOMContentLoaded', () => {
    // Inicializar contadores de votos con valores almacenados en localStorage o 0 si no existen
    let votes = {
        messi: parseInt(localStorage.getItem('votes.messi')) || 0,
        cristiano: parseInt(localStorage.getItem('votes.cristiano')) || 0
    };

    // Variables de control para el tiempo de espera
    let canVote = true;
    const cooldownTime = 5000; // 5000 ms = 5 segundos

    // Obtener elementos del DOM
    const messiButton = document.querySelector('button[data-player="messi"]');
    const cristianoButton = document.querySelector('button[data-player="cristiano"]');
    const messiCount = document.getElementById('messi-count');
    const cristianoCount = document.getElementById('cristiano-count');
    const messiResult = document.getElementById('messi-result');
    const cristianoResult = document.getElementById('cristiano-result');
    const rankingImage = document.getElementById('ranking-image');
    const topPlayer = document.getElementById('top-player');
    const topVotes = document.getElementById('top-votes');

    // Función para actualizar los contadores y resultados
    function updateVotes() {
        messiCount.textContent = `${votes.messi} votos`;
        cristianoCount.textContent = `${votes.cristiano} votos`;
        messiResult.textContent = votes.messi;
        cristianoResult.textContent = votes.cristiano;

        // Determinar el jugador con más votos
        if (votes.messi > votes.cristiano) {
            topPlayer.textContent = 'Messi';
            topVotes.textContent = `${votes.messi} votos`;
            rankingImage.src = 'images/messi.jpg'; // Imagen de Messi
        } else if (votes.cristiano > votes.messi) {
            topPlayer.textContent = 'Cristiano Ronaldo';
            topVotes.textContent = `${votes.cristiano} votos`;
            rankingImage.src = 'images/cristiano.jpg'; // Imagen de Cristiano Ronaldo
        } else {
            topPlayer.textContent = 'Empate';
            topVotes.textContent = `${votes.messi} votos`;
            rankingImage.src = ''; // No mostrar imagen si hay empate
        }

        // Guardar los votos en localStorage
        localStorage.setItem('votes.messi', votes.messi);
        localStorage.setItem('votes.cristiano', votes.cristiano);
    }

    // Función para manejar el clic en los botones
    function handleVote(player) {
        if (!canVote) return; // No permitir votar si aún no ha pasado el tiempo

        canVote = false; // Deshabilitar el botón
        votes[player]++;
        updateVotes();

        // Rehabilitar el botón después del tiempo de espera
        setTimeout(() => {
            canVote = true;
        }, cooldownTime);
    }

    // Evento de clic para el botón de Messi
    messiButton.addEventListener('click', () => handleVote('messi'));

    // Evento de clic para el botón de Cristiano Ronaldo
    cristianoButton.addEventListener('click', () => handleVote('cristiano'));

    // Inicializar la vista
    updateVotes();
});