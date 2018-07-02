import React from 'react';


import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { InputText } from 'primereact/components/inputtext/InputText';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';


class VerPalpites extends React.Component {


    constructor() {
        super();
        this.state = {
            filters: {},
            selecoes: null,
            palpites: null,
        };
    }


    async componentDidMount() {
        const responseSelecoes = await fetch('http://localhost:8080/BolaoDaCopaV2RS/webresources/palpite/selecoes');
        var contentTypeSelecoes = responseSelecoes.headers.get("content-type");
        if (contentTypeSelecoes && contentTypeSelecoes.includes("application/json")) {
            const selecoesJson = await responseSelecoes.json();
            const selecoesOptions = selecoesJson.map((selecao) => { return { label: selecao, value: selecao }; });
            selecoesOptions.unshift( { label: 'Todas', value: null});
            this.setState({ selecoes: selecoesOptions });
        }

        const responsePalpites = await fetch('http://localhost:8080/BolaoDaCopaV2RS/webresources/palpite');
        var contentTypePalpites = responsePalpites.headers.get("content-type");
        if (contentTypePalpites && contentTypePalpites.includes("application/json")) {
            const palpitesJson = await responsePalpites.json();
            this.setState({ palpites: palpitesJson });
        }
    }


    onCampeaoChange(e) {
        let filters = this.state.filters;
        filters['campeao'] = { value: e.value };
        this.setState({ filters: filters });
    }


    onViceChange(e) {
        let filters = this.state.filters;
        filters['vice'] = { value: e.value };
        this.setState({ filters: filters });
    }


    onFilter(e) {
        this.setState({ filters: e.filters });
    }


    render() {
        var header = <div style={{ 'textAlign': 'left' }}>
            <i className="fa fa-search" style={{ margin: '4px 4px 0 0' }}></i>
            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Pesquisar em todos os campos" size="50" />
        </div>;


        let campeaoFilter = <Dropdown style={{ width: '100%' }} className="ui-column-filter" value={this.state.filters.campeao ? this.state.filters.campeao.value : null} options={this.state.selecoes} onChange={(e) => this.onCampeaoChange(e)} />
        let viceFilter = <Dropdown style={{ width: '100%' }} className="ui-column-filter" value={this.state.filters.vice ? this.state.filters.vice.value : null} options={this.state.selecoes} onChange={(e) => this.onViceChange(e)} />


        return (
            <div>
                <div className="content-section introduction">
                    <div className="feature-intro">
                        <h1>Palpites feitos até agora</h1>
                    </div>
                </div>


                <div className="content-section implementation">
                    <DataTable value={this.state.palpites} paginator={true} rows={10} header={header}
                        globalFilter={this.state.globalFilter} filters={this.state.filters} onFilter={(e) => this.onFilter(e)}>
                        <Column field="palpiteiro.nome" header="Palpiteiro" filter={true} filterMatchMode='contains' />
                        <Column field="campeao" header="Campeão" filter={true} filterElement={campeaoFilter} filterMatchMode="equals" />
                        <Column field="vice" header="Vice" filter={true} filterElement={viceFilter} filterMatchMode="equals" />
                    </DataTable>
                </div>
            </div>
        );
    }
}

export default VerPalpites;