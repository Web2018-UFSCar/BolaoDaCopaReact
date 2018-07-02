import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
    <div className="row">
        <div className="col-lg-12 text-center">
            <h1>Bolão da Copa 2.0</h1>
            <p>Participe da melhor competição
            do futebol mundial de um jeito
            muito mais intere$$ante!</p>
            <p>Entrando no bolão, todos os jogos
            passarão a ser importantes!
            Até mesmo o clássico Azerbaijão
            e Moldávia!</p>


            <h3>Selecione a opção abaixo</h3>
            <p>
                <Link to='palpiteForm' className="btn btn-success btn-space">Palpitar</Link>
                <Link to='verPalpites' className="btn btn-success btn-space">Ver os palpites</Link>
            </p>
        </div>
    </div>
)


export default Home;