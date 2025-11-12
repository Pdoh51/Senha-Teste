const senhas = [
  "236,75",
  "O que o ovo novo disse pro ovo velho? Cancan",
  "vai",
  "acertar",
  "essa"
];

let faseAtual = 0;
let mensagemTimeout = null;

function verificarSenha() {
  const senhaDigitada = document.getElementById("senha").value;
  const mensagem = document.getElementById("mensagem");
  const cadeadosContainer = document.getElementById("cadeados");

  // Limpa timeout anterior para evitar sobreposição
  clearTimeout(mensagemTimeout);
  mensagem.classList.remove("ocultar");
  mensagem.style.opacity = "1";

  if (senhaDigitada === senhas[faseAtual]) {
    // Atualiza cadeado visual
    const cadeado = document.getElementById(`cadeado${faseAtual}`);
    cadeado.src = "./src/img/cadeado_aberto.png";
    cadeado.classList.add("verde");

    // Pausa música atual e toca som de acerto
    const acertoAudio = document.getElementById("acertoAudio");
    const musica = document.getElementById("musicaFase");

    if (musica) {
      musica.pause();
      musica.currentTime = 0;
    }

    if (acertoAudio) {
      acertoAudio.currentTime = 0;
      acertoAudio.play();

      acertoAudio.onended = () => {
        if (musica) {
          if (faseAtual + 1 < senhas.length) {
            musica.src = `./src/audio/music_fase_${faseAtual + 2}.mp3`;
          } else {
            musica.src = `./src/audio/music_fase_final.mp3`;
          }

          musica.loop = true;
          musica.play();
        }
      };
    }

    faseAtual++;

    if (faseAtual < senhas.length) {
      mensagem.textContent = `Senha correta!`;
      mensagem.style.color = "green";
      document.getElementById("senha").value = "";
      mostrarCursor();

      // Atualiza conteúdo da fase
      mostrarConteudoFase(faseAtual + 1);

      // Oculta mensagem após 3 segundos
      mensagemTimeout = setTimeout(() => {
        mensagem.style.opacity = "0";
      }, 3000);
    } else {
      mensagem.textContent = "Você completou o desafio!";
      mensagem.style.color = "green";
      document.querySelector(".linha-senha").style.display = "none";

      // Oculta mensagem final e cadeados após 5 segundos
      mensagemTimeout = setTimeout(() => {
        mensagem.style.opacity = "0";
        cadeadosContainer.style.opacity = "0";
      }, 5000);
    }
  } else {
    mensagem.textContent = `Senha incorreta!`;
    mensagem.style.color = "red";

    // Toca som de erro
    const erroAudio = document.getElementById("erroAudio");
    if (erroAudio) {
      erroAudio.currentTime = 0;
      erroAudio.play();
    }

    // Oculta mensagem após 3 segundos
    mensagemTimeout = setTimeout(() => {
      mensagem.style.opacity = "0";
    }, 3000);
  }
}

function mostrarConteudoFase(fase) {
  const todasAsFases = document.querySelectorAll(".resposta-fase");
  todasAsFases.forEach(div => div.style.display = "none");

  const ativa = document.querySelector(`.fase_${fase}`);
  if (ativa) {
    ativa.style.display = "block";
  }
}

function esconderCursor() {
  document.getElementById("cursor").style.display = "none";
}

function mostrarCursor() {
  const senha = document.getElementById("senha").value;
  const cursor = document.getElementById("cursor");

  if (senha === "") {
    cursor.style.display = "inline";
  } else {
    cursor.style.display = "none";
  }
}

// Permitir envio com Enter
document.getElementById("senha").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    verificarSenha();
  }
});

// Ativar fase 1 ao carregar a página e iniciar música
window.onload = function() {
  document.getElementById("senha").focus();
  mostrarConteudoFase(1);

  const musica = document.getElementById("musicaFase");
  if (musica) {
    musica.currentTime = 0;
    musica.loop = true;
    musica.play().catch(() => {
      document.body.addEventListener("click", () => {
        musica.play();
      }, { once: true });
    });
  }
};
