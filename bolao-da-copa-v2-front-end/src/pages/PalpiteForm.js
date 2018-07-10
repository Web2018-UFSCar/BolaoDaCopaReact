import React from 'react';
import NovoPalpiteMaquinaEstados from './NovoPalpiteMaquinaEstados';
// Import do component do select dinamico
import Select from 'react-select';
import 'react-select/dist/react-select.css';


class PalpiteForm extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            senha: '',
            nome: '',
            telefone: '',
            dataDeNascimento: '',
            campeao: '',
            vice: '',
            confirmarSenha: '',
            estado: NovoPalpiteMaquinaEstados.inicio(),
            mensagem: 'Digite seu e-mail para dar início',
            mensagemClassName: 'alert alert-info',
            usuarioEncontrado: null,
            mostrarAjaxLoader: false,
            mensagensValidacao: {
                email: '',
                senha: '',
                nome: '',
                telefone: '',
                dataDeNascimento: '',
                campeao: '',
                vice: '',
                confirmarSenha: '',
            },
            paises: null // ira guardar os paises recuperados do backend
        };
    }

    async componentDidMount() {
        // Recupera a lista de paises
        const responsePalpites = await fetch('http://localhost:8080/BolaoDaCopaV2RS/webresources/pais');
        var contentTypePalpites = responsePalpites.headers.get("content-type");
        if (contentTypePalpites && contentTypePalpites.includes("application/json")) {
            const paisesJson = await responsePalpites.json();
            // Necessário o formato {value, label} para o component Select
            this.setState({ paises: paisesJson.map(pais => { return { value: pais.nome, label: pais.nome } }) });
        }
    }

    handleUserInput(e) {
        const nome = e.target.name;
        const valor = e.target.value;
        const mensagensValidacao = Object.assign({}, this.state.mensagensValidacao);
        mensagensValidacao[nome] = this.validarCampo({ nome, valor });
        this.setState({
            [nome]: valor,
            mensagensValidacao,
        });
    }

    // Devido ao comportamento diferente do Select
    // chamamos esse método para lidar com a mudança de valor
    handleSelectChange(nome, e) {
        const valor = e != null ? e.value : ''; // null = evento de deleção do valor

        const mensagensValidacao = Object.assign({}, this.state.mensagensValidacao);
        mensagensValidacao[nome] = this.validarCampo({ nome, valor });
        this.setState({
            [nome]: valor,
            mensagensValidacao,
        });
    }

    validarCampo({ nome, valor = null }) {        
        if (valor === null) {
            valor = this.state[nome];
        }

        if (nome === 'email') {
            if (!/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(valor)) {
                return 'E-mail está em formato incorreto';
            }
        } else if (nome === 'senha') {
            if (valor.length === 0) {
                return 'Senha não pode ser vazia';
            } else if (this.state.usuarioEncontrado === null) {
                if (valor.length < 6) {
                    return 'Senha muito curta';
                }
            }
        } else if (nome === 'vice') {
            if (valor.length === 0) {
                return 'Vice não pode ser vazio';
            }
            if (valor === this.state.campeao) {
                return 'Campeão e vice não podem ser iguais';
            }
        } else if (nome === 'telefone'){
	    if (valor === ''){
	         return 'Não pode ser vazio';
	    } else if (!/[0-9]+/.test(valor)){
		  return 'Telefone está em formato incorreto';
	      }
	} else if (nome === 'nome'){
	    if (valor === ''){
	         return 'Não pode ser vazio';
	    } else if (!/[aA-zZ]+/.test(valor)){
		  return 'Nome está em formato incorreto';
	      }
	}
        else if (nome === 'dataDeNascimento' || nome === 'campeao') {
            if (valor === '') {
                return 'Não pode ser vazio';
            } 
        } else if (nome === 'confirmarSenha') {
            if (this.state.usuarioEncontrado === null && this.state.estado.botaoConfirmarPalpiteVisivel) {
                const senha = this.state.senha;
                if (valor !== senha) {
                    return 'Confirmação da senha não confere';
                }
            }
        }
        return '';
    }


    validarFormulario() {
        const mensagensValidacao = Object.assign({}, this.state.mensagensValidacao);


        let temErro = false;


        for (let campo in mensagensValidacao) {
            const msg = this.validarCampo({ nome: campo });
            mensagensValidacao[campo] = msg;
            if (msg !== '') temErro = true;
        }


        this.setState({ mensagensValidacao });
        return !temErro;
    }

    handleSenhaChanged() {
        if (!this.state.estado.eventoSenhaDesabilitado) {
            if (this.state.senha === this.state.usuarioEncontrado.senha) {
                const d = new Date(this.state.usuarioEncontrado.dataDeNascimento.slice(0, -5));
                this.setState({
                    nome: this.state.usuarioEncontrado.nome,
                    telefone: this.state.usuarioEncontrado.telefone,
                    dataDeNascimento: d.toISOString().slice(0, 10),
                });
                this.setState({ estado: NovoPalpiteMaquinaEstados.usuarioExistenteSenhaCorreta() });
                this.mostrarSucesso('Senha correta! Informe seu palpite!');


            } else {
                this.setState({ estado: NovoPalpiteMaquinaEstados.usuarioExistenteSenhaIncorreta() });
                this.mostrarErro('Senha incorreta! Informe novamente!');
            }
        }
    }

    handleEnviarPalpiteClicked() {
        if (!this.validarFormulario()) {
            this.mostrarErro('Atenção! Alguns campos não foram corretamente preenchidos!');
            return;
        }
        if (this.state.usuarioEncontrado === null) {
            this.setState({ estado: NovoPalpiteMaquinaEstados.confirmarPalpiteUsuarioInexistente() });
            this.mostrarInfo('Verifique os dados, repita sua nova senha e confirme o palpite. Atenção, ao confirmar o palpite você concorda em pagar R$ 20,00');
        } else {
            this.setState({ estado: NovoPalpiteMaquinaEstados.confirmarPalpiteUsuarioExistente() });
            this.mostrarInfo('Verifique os dados e confirme o palpite. Atenção, ao confirmar o palpite você concorda em pagar R$ 20,00');
        }
    }

    async handleEmailChanged() {
        if (this.validarCampo({ nome: 'email' }) !== '') return;
        this.mostrarAjaxLoader();
        try {
            const response = await fetch('http://localhost:8080/BolaoDaCopaV2RS/webresources/usuario?email=' + this.state.email);
            var contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const usuarioJson = await response.json();
                this.setState({
                    estado: NovoPalpiteMaquinaEstados.usuarioExistente(),
                    usuarioEncontrado: usuarioJson
                });
                this.mostrarAviso('E-mail já cadastrado! Informe sua senha para enviar o palpite');
            } else {
                this.setState({ estado: NovoPalpiteMaquinaEstados.usuarioInexistente() });
                this.mostrarInfo('E-mail ainda não cadastrado! Informe uma nova senha e demais dados para cadastro');
            }
        } catch (e) {
            this.mostrarErro('Ocorreu um problema!');
            console.log(e);
        }
        this.ocultarAjaxLoader();
    }

    async handleConfirmarPalpiteClicked() {
        if (!this.validarFormulario()) {
            this.mostrarErro('Atenção! Alguns campos não foram corretamente preenchidos!');
            return;
        }
        this.mostrarAjaxLoader();
        try {
            const novoPalpite = {
                campeao: this.state.campeao,
                vice: this.state.vice,
                palpiteiro: {
                    id: null,
                }
            };
            if (this.state.usuarioEncontrado === null) {
                const novoUsuario = {
                    nome: this.state.nome,
                    senha: this.state.senha,
                    email: this.state.email,
                    telefone: this.state.telefone,
                    dataDeNascimento: new Date(this.state.dataDeNascimento),
                };
                const response = await fetch('http://localhost:8080/BolaoDaCopaV2RS/webresources/usuario', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify(novoUsuario),
                })
                const usuarioGravado = await response.json();
                novoPalpite.palpiteiro.id = usuarioGravado.id;
            } else {
                novoPalpite.palpiteiro.id = this.state.usuarioEncontrado.id;
            }
            await fetch('http://localhost:8080/BolaoDaCopaV2RS/webresources/palpite', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(novoPalpite),
            });


            this.mostrarSucesso(`Obrigado pelo palpite, ${this.state.nome}!`);
            this.setState({
                email: '',
                senha: '',
                nome: '',
                telefone: '',
                dataDeNascimento: '',
                campeao: '',
                vice: '',
                confirmarSenha: '',
                usuarioEncontrado: null,
            });
            this.setState({ estado: NovoPalpiteMaquinaEstados.inicio() });
        } catch (e) {
            this.mostrarErro('Ocorreu um problema!');
            console.log(e);
        }
        this.ocultarAjaxLoader();
    }

    estiloCampo(campo) {
        var className = "form-control "
        if(this.state[campo]) {
            className += this.state.mensagensValidacao[campo] ? 'is-invalid' : 'is-valid';
        }

        return className;
    };

    mostrarAviso(mensagem) { this.setState({ mensagem, mensagemClassName: 'alert alert-warning', }); }
    mostrarInfo(mensagem) { this.setState({ mensagem, mensagemClassName: 'alert alert-info', }); }
    mostrarSucesso(mensagem) { this.setState({ mensagem, mensagemClassName: 'alert alert-success', }); }
    mostrarErro(mensagem) { this.setState({ mensagem, mensagemClassName: 'alert alert-danger', }); }
    mostrarAjaxLoader() { this.setState({ mostrarAjaxLoader: true }); }
    ocultarAjaxLoader() { this.setState({ mostrarAjaxLoader: false }); }

    render() {
        return (
            <div className="row">
                <div className="col-lg-12 text-center">
                    <h4>Novo palpite</h4>
                    <form className="form-horizontal" name="formPalpite">
                        <div className={this.state.mensagemClassName}>
                            {this.state.mensagem}
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label" htmlFor="email">E-mail</label>
                            <div className="col-sm-4">
                                <input type="email"
                                    required
                                    className={this.estiloCampo('email')}
                                    name="email"
                                    label="E-mail"
                                    value={this.state.email}
                                    onChange={(event) => this.handleUserInput(event)}
                                    onBlur={() => this.handleEmailChanged()} />
                                <span className="text text-danger">{this.state.mensagensValidacao['email']}</span>
                            </div>
                            <label className="col-sm-2 control-label" htmlFor="senha">Senha</label>
                            <div className="col-sm-4">
                                <input type="password"
                                    className={this.estiloCampo('senha')}
                                    name="senha"
                                    label="Senha"
                                    disabled={this.state.estado.campoSenhaDesabilitado}
                                    value={this.state.senha}
                                    onChange={(event) => this.handleUserInput(event)}
                                    onBlur={() => this.handleSenhaChanged()} />
				<span className="text text-danger">{this.state.mensagensValidacao['senha']}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label" htmlFor="nome">Nome completo</label>
                            <div className="col-sm-10">
                                <input type="text"
                                    className={this.estiloCampo('nome')}
                                    name="nome"
                                    label="Nome"
                                    disabled={this.state.estado.camposDadosPessoaisDesabilitados}
                                    value={this.state.nome}
                                    onChange={(event) => this.handleUserInput(event)} />
				<span className="text text-danger">{this.state.mensagensValidacao['nome']}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label" htmlFor="telefone">Telefone</label>
                            <div className="col-sm-4">
                                <input type="text"
                                    className={this.estiloCampo('telefone')}
                                    name="telefone"
                                    label="Telefone"
                                    disabled={this.state.estado.camposDadosPessoaisDesabilitados}
                                    value={this.state.telefone}
                                    onChange={(event) => this.handleUserInput(event)} />
				<span className="text text-danger">{this.state.mensagensValidacao['telefone']}</span>
                            </div>
                            <label className="col-sm-3 control-label" htmlFor="dataDeNascimento">Data de nascimento</label>
                            <div className="col-sm-3">
                                <input type="date"
                                    className={this.estiloCampo('dataDeNascimento')}
                                    name="dataDeNascimento"
                                    label="Data de nascimento"
                                    disabled={this.state.estado.camposDadosPessoaisDesabilitados}
                                    value={this.state.dataDeNascimento}
                                    onChange={(event) => this.handleUserInput(event)}>
				<span className="text text-danger">{this.state.mensagensValidacao['dataDeNascimento']}</span>
                                </input>
                            </div>
                        </div>


                        <div className={this.state.estado.camposDadosPalpiteDestaque ? 'form-group has-success' : 'form-group'}>
                            <label className="col-sm-2 control-label" htmlFor="campeao">Campeão</label>
                            <div className="col-sm-4">
                                <Select
                                    label="Campeão"
                                    name="campeao"
                                    value={this.state.campeao}
                                    disabled={this.state.estado.camposDadosPalpiteDesabilitados}
                                    onChange={(event) => this.handleSelectChange('campeao', event)}
                                    options={this.state.paises}/>
                            </div>

                            {this.state.estado.campoConfirmacaoSenhaVisivel && (
                                <label className="col-sm-2 control-label" htmlFor="confirmarSenha">Confirme a senha</label>
                            )}
                            <div className="col-sm-4">
                                {this.state.estado.campoConfirmacaoSenhaVisivel && (
                                    <input type="password"
                                    className={this.estiloCampo('confirmarSenha')}
                                        name="confirmarSenha"
                                        label="Confirmação de senha"
                                        value={this.state.confirmarSenha}
                                        onChange={(event) => this.handleUserInput(event)} />
                                )}
                                <span className="text text-danger">{this.state.mensagensValidacao['confirmarSenha']}</span>
                            </div>
                        </div>
                        <div className={this.state.estado.camposDadosPalpiteDestaque ? 'form-group has-success' : 'form-group'}>
                            <label className="col-sm-2 control-label" htmlFor="vice">Vice</label>
                            <div className="col-sm-4">
                                <Select
                                    label="Vice"
                                    name="vice"
                                    value={this.state.vice}
                                    disabled={this.state.estado.camposDadosPalpiteDesabilitados}
                                    onChange={(event) => this.handleSelectChange('vice', event)}
                                    options={this.state.paises}/>
                            </div>
                            
                            <div className="col-sm-6">
                                {this.state.estado.botaoConfirmarPalpiteVisivel && (
                                    <a type="submit"
                                        className="btn btn-success"
                                        name="confirmar"
                                        onClick={() => this.handleConfirmarPalpiteClicked()}>
                                        Confirmar meu palpite
                                    </a>
                                )}
                            </div>
                        </div>


                        <div className="form-group">
                            <div className="col-sm-12">
                                <a className="btn btn-default"
                                    name="enviar"
                                    disabled={this.state.estado.botaoEnvioDesabilitado}
                                    onClick={() => this.handleEnviarPalpiteClicked()}>
                                    Enviar meu palpite
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
                {this.state.mostrarAjaxLoader && (<div className='ajaxLoaderClass' />)}
            </div>
        );
    }
}


export default PalpiteForm;
