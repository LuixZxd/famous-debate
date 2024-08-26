document.addEventListener('DOMContentLoaded', () => {
    const messiButton = document.getElementById('messi-vote');
    const ronaldoButton = document.getElementById('ronaldo-vote');
    const modal = document.getElementById('modal');
    const closeModalButton = document.getElementById('close-modal');
    const feedback = document.createElement('div');
    feedback.className = 'vote-feedback';
    feedback.textContent = '¡Voto registrado!';
    document.body.appendChild(feedback);

    let messiVotes = localStorage.getItem('messiVotes') ? parseInt(localStorage.getItem('messiVotes')) : 0;
    let ronaldoVotes = localStorage.getItem('ronaldoVotes') ? parseInt(localStorage.getItem('ronaldoVotes')) : 0;

    function updateRanking() {
        const topPlayer = document.getElementById('top-player');
        const topPlayerImg = document.getElementById('top-player-img');
        const topPlayerName = document.getElementById('top-player-name');
        const topPlayerNumber = document.getElementById('top-player-number');
        const messiRanking = document.getElementById('messi-ranking');
        const ronaldoRanking = document.getElementById('ronaldo-ranking');

        if (messiVotes > ronaldoVotes) {
            topPlayerImg.src = 'messi.jpg';
            topPlayerName.textContent = 'Lionel Messi';
            topPlayerNumber.textContent = '#1';
            messiRanking.classList.add('highlight');
            ronaldoRanking.classList.remove('highlight');
        } else if (ronaldoVotes > messiVotes) {
            topPlayerImg.src = 'ronaldo.jpg';
            topPlayerName.textContent = 'Cristiano Ronaldo';
            topPlayerNumber.textContent = '#1';
            ronaldoRanking.classList.add('highlight');
            messiRanking.classList.remove('highlight');
        } else {
            topPlayerImg.src = '';
            topPlayerName.textContent = 'Empate';
            topPlayerNumber.textContent = '';
            messiRanking.classList.remove('highlight');
            ronaldoRanking.classList.remove('highlight');
        }
        messiRanking.textContent = `Messi - ${messiVotes} votos`;
        ronaldoRanking.textContent = `Ronaldo - ${ronaldoVotes} votos`;
    }

    function handleVote(vote) {
        if (document.querySelector('button:disabled')) return;

        document.querySelectorAll('button').forEach(btn => btn.disabled = true);
        feedback.style.display = 'block';
        setTimeout(() => feedback.style.display = 'none', 2000);

        if (vote === 'messi') {
            messiVotes++;
            localStorage.setItem('messiVotes', messiVotes);
            playSound('messi-top.mp3');
        } else {
            ronaldoVotes++;
            localStorage.setItem('ronaldoVotes', ronaldoVotes);
            playSound('ronaldo.mp3');
        }
        updateRanking();
        modal.classList.add('show');
        setTimeout(() => modal.classList.remove('show'), 5000);
        setTimeout(() => document.querySelectorAll('button').forEach(btn => btn.disabled = false), 5000);
    }

    function playSound(file) {
        const audio = new Audio(file);
        audio.play();
    }

    messiButton.addEventListener('click', () => handleVote('messi'));
    ronaldoButton.addEventListener('click', () => handleVote('ronaldo'));
    closeModalButton.addEventListener('click', () => modal.classList.remove('show'));

    // Initialize ranking on page load
    updateRanking();
});
