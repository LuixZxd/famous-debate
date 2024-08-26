document.addEventListener('DOMContentLoaded', () => {
    const messiButton = document.getElementById('messi-vote');
    const ronaldoButton = document.getElementById('ronaldo-vote');
    const modal = document.getElementById('modal');
    const closeModalButton = document.getElementById('close-modal');
    const feedback = document.createElement('div');
    feedback.className = 'vote-feedback';
    feedback.textContent = '¡Voto registrado!';
    document.body.appendChild(feedback);

    // Initialize IndexedDB
    const dbRequest = indexedDB.open('votesDB', 1);
    let db;

    dbRequest.onupgradeneeded = (event) => {
        db = event.target.result;
        const objectStore = db.createObjectStore('votes', { keyPath: 'player' });
        objectStore.createIndex('player', 'player', { unique: true });
    };

    dbRequest.onsuccess = (event) => {
        db = event.target.result;
        updateRanking();
    };

    dbRequest.onerror = (event) => {
        console.error('Database error:', event.target.errorCode);
    };

    function updateRanking() {
        const transaction = db.transaction(['votes'], 'readonly');
        const objectStore = transaction.objectStore('votes');
        const messiRequest = objectStore.get('messi');
        const ronaldoRequest = objectStore.get('ronaldo');

        messiRequest.onsuccess = () => {
            messiVotes = messiRequest.result ? messiRequest.result.votes : 0;
            ronaldoRequest.onsuccess = () => {
                ronaldoVotes = ronaldoRequest.result ? ronaldoRequest.result.votes : 0;
                render();
            };
        };
    }

    function handleVote(vote) {
        if (document.querySelector('button:disabled')) return;

        document.querySelectorAll('button').forEach(btn => btn.disabled = true);
        feedback.style.display = 'block';
        setTimeout(() => feedback.style.display = 'none', 2000);

        const transaction = db.transaction(['votes'], 'readwrite');
        const objectStore = transaction.objectStore('votes');
        const request = objectStore.get(vote);

        request.onsuccess = () => {
            const currentVotes = request.result ? request.result.votes : 0;
            objectStore.put({ player: vote, votes: currentVotes + 1 });
            if (vote === 'messi') {
                playSound('messi.mp3');
            } else {
                playSound('ronaldo.mp3');
            }
            updateRanking();
            modal.classList.add('show');
            setTimeout(() => modal.classList.remove('show'), 5000);
            setTimeout(() => document.querySelectorAll('button').forEach(btn => btn.disabled = false), 5000);
        };
    }

    function playSound(file) {
        const audio = new Audio(file);
        audio.play();
    }

    function render() {
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

    messiButton.addEventListener('click', () => handleVote('messi'));
    ronaldoButton.addEventListener('click', () => handleVote('ronaldo'));
    closeModalButton.addEventListener('click', () => modal.classList.remove('show'));
});
                                           
