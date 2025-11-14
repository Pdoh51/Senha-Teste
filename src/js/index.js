const senhas = ["1", "1", "1", "1", "1"];
let faseAtual = 0;
let mensagemTimeout = null;

function verificarSenha() {
  const senhaDigitada = document.getElementById("senha").value;
  const mensagem = document.getElementById("mensagem");
  const cadeadosContainer = document.getElementById("cadeados");

  clearTimeout(mensagemTimeout);
  mensagem.classList.remove("ocultar");
  mensagem.style.opacity = "1";

  if (senhaDigitada === senhas[faseAtual]) {
    const cadeado = document.getElementById(`cadeado${faseAtual}`);
    cadeado.src = "./src/img/cadeado_aberto.png";
    cadeado.classList.add("verde");

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
            musica.src = `./src/audio/music_fase_${faseAtual + 1}.mp3`;
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
      mostrarConteudoFase(faseAtual + 1);

      mensagemTimeout = setTimeout(() => {
        mensagem.style.opacity = "0";
      }, 3000);
    } else {
      mensagem.textContent = "Você completou o desafio!";
      mensagem.style.color = "green";
      document.querySelector(".linha-senha").style.display = "none";

      mensagemTimeout = setTimeout(() => {
        mensagem.style.opacity = "0";
        cadeadosContainer.style.opacity = "0";
      }, 5000);
    }
  } else {
    mensagem.textContent = `Senha incorreta!`;
    mensagem.style.color = "red";

    const erroAudio = document.getElementById("erroAudio");
    if (erroAudio) {
      erroAudio.currentTime = 0;
      erroAudio.play();
    }

    mensagemTimeout = setTimeout(() => {
      mensagem.style.opacity = "0";
    }, 3000);
  }
}

function mostrarConteudoFase(fase) {
  const todasAsFases = document.querySelectorAll(".resposta-fase");
  todasAsFases.forEach(div => (div.style.display = "none"));

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
  cursor.style.display = senha === "" ? "inline" : "none";
}

document.getElementById("senha").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    verificarSenha();
  }
});

window.onload = function () {
  document.getElementById("senha").focus();
  mostrarConteudoFase(1);
};

// Inicia música ao clicar em "Abir presente"
document.getElementById("botaoIniciar").addEventListener("click", () => {
  const musica = document.getElementById("musicaFase");
  const tela = document.getElementById("telaBoasVindas");

  if (musica) {
    musica.currentTime = 0;
    musica.loop = true;
    musica.play();
  }

  tela.style.display = "none";
});

// Para a música ao sair ou recarregar a página
window.addEventListener("beforeunload", () => {
  const musica = document.getElementById("musicaFase");
  if (musica) {
    musica.pause();
    musica.currentTime = 0;
  }
});

// Reinicia a música se o usuário voltar para a aba
document.addEventListener("visibilitychange", () => {
  const musica = document.getElementById("musicaFase");
  if (!document.hidden && musica && musica.paused) {
    musica.play().catch(() => {
      document.body.addEventListener("click", () => musica.play(), { once: true });
    });
  }
});