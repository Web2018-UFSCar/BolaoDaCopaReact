class NovoPalpiteMaquinaEstados {
    static inicio() {
        return {
            campoSenhaDesabilitado: true,
            eventoSenhaDesabilitado: true,
            camposDadosPessoaisDesabilitados: true,
            camposDadosPalpiteDesabilitados: true,
            camposDadosPalpiteDestaque: false,
            botaoEnvioDesabilitado: true,
            campoConfirmacaoSenhaVisivel: false,
            botaoConfirmarPalpiteVisivel: false,


        };
    }


    static usuarioExistente() {
        return {
            campoSenhaDesabilitado: false,
            eventoSenhaDesabilitado: false,
            camposDadosPessoaisDesabilitados: true,
            camposDadosPalpiteDesabilitados: true,
            camposDadosPalpiteDestaque: false,
            botaoEnvioDesabilitado: true,
            campoConfirmacaoSenhaVisivel: false,
            botaoConfirmarPalpiteVisivel: false,
        };
    }


    static usuarioExistenteSenhaCorreta() {
        return {
            campoSenhaDesabilitado: false,
            eventoSenhaDesabilitado: false,
            camposDadosPessoaisDesabilitados: true,
            camposDadosPalpiteDesabilitados: false,
            camposDadosPalpiteDestaque: false,
            botaoEnvioDesabilitado: false,
            campoConfirmacaoSenhaVisivel: false,
            botaoConfirmarPalpiteVisivel: false,
        };
    }


    static usuarioExistenteSenhaIncorreta() {
        return {
            campoSenhaDesabilitado: false,
            eventoSenhaDesabilitado: false,
            camposDadosPessoaisDesabilitados: true,
            camposDadosPalpiteDesabilitados: true,
            camposDadosPalpiteDestaque: false,
            botaoEnvioDesabilitado: true,
            campoConfirmacaoSenhaVisivel: false,
            botaoConfirmarPalpiteVisivel: false,
        };
    }


    static usuarioInexistente() {
        return {
            campoSenhaDesabilitado: false,
            eventoSenhaDesabilitado: true,
            camposDadosPessoaisDesabilitados: false,
            camposDadosPalpiteDesabilitados: false,
            camposDadosPalpiteDestaque: false,
            botaoEnvioDesabilitado: false,
            campoConfirmacaoSenhaVisivel: false,
            botaoConfirmarPalpiteVisivel: false,
        };
    }


    static confirmarPalpiteUsuarioExistente() {
        return {
            campoSenhaDesabilitado: false,
            eventoSenhaDesabilitado: true,
            camposDadosPessoaisDesabilitados: false,
            camposDadosPalpiteDesabilitados: false,
            camposDadosPalpiteDestaque: true,
            botaoEnvioDesabilitado: false,
            campoConfirmacaoSenhaVisivel: false,
            botaoConfirmarPalpiteVisivel: true,
        };
    }


    static confirmarPalpiteUsuarioInexistente() {
        return {
            campoSenhaDesabilitado: false,
            eventoSenhaDesabilitado: true,
            camposDadosPessoaisDesabilitados: false,
            camposDadosPalpiteDesabilitados: false,
            camposDadosPalpiteDestaque: true,
            botaoEnvioDesabilitado: false,
            campoConfirmacaoSenhaVisivel: true,
            botaoConfirmarPalpiteVisivel: true,
        };
    }
}

export default NovoPalpiteMaquinaEstados;