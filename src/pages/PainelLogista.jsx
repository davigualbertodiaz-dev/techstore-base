import { formatarPreco } from '../utils/formatarPreco'

const CATEGORIAS = [
    { id: 'roupas', nome: 'Roupas' },
    { id: 'eletronicos', nome: 'Eletrônicos' },
    { id: 'acessorios', nome: 'Acessórios' },
    { id: 'casa', nome: 'Casa' },
]

function precoNumerico(valor) {
    const numero = Number(valor)
    return Number.isFinite(numero) ? numero : 0
}

export default function PainelLogista({ produtos, listaEspera = [] }) {
    const produtosComPreco = produtos.filter((produto) => Number.isFinite(Number(produto.price)))
    const produtosSemPreco = produtos.filter((produto) => !Number.isFinite(Number(produto.price)))
    const produtosEsgotados = produtos.filter((produto) => Number(produto.estoque || 0) === 0)

    const totalEstoque = produtosComPreco.reduce(
        (total, produto) => total + precoNumerico(produto.price) * Number(produto.estoque || 0),
        0
    )

    const clientesEmEspera = listaEspera.length

    const resumoPorCategoria = CATEGORIAS.map((categoria) => {
        const itens = produtos.filter((produto) => produto.category === categoria.id)
        const valorEstoque = itens.reduce(
            (total, produto) => total + precoNumerico(produto.price) * Number(produto.estoque || 0),
            0
        )
        const lucroEstimado = itens.reduce((total, produto) => {
            const precoAtual = precoNumerico(produto.price)
            const precoBase = precoNumerico(produto.precoOriginal || produto.price)
            return total + Math.max(0, (precoBase - precoAtual) * Number(produto.estoque || 0))
        }, 0)

        return {
            ...categoria,
            valorEstoque,
            unidades: itens.reduce((total, produto) => total + Number(produto.estoque || 0), 0),
            lucroEstimado,
        }
    })

    return (
        <section className="painel-logista">
            <p className="sobretitulo">Dashboard interno</p>
            <h1>Painel de Logista</h1>

            <div className="painel-grid">
                <article className="painel-card painel-card-destaque">
                    <span className="painel-label">Valor parado em estoque</span>
                    <strong>{formatarPreco(totalEstoque)}</strong>
                </article>

                <article className="painel-card">
                    <span className="painel-label">Itens aguardando preço</span>
                    <strong>{produtosSemPreco.length}</strong>
                </article>

                <article className="painel-card">
                    <span className="painel-label">Produtos esgotados</span>
                    <strong>{produtosEsgotados.length}</strong>
                </article>

                <article className="painel-card">
                    <span className="painel-label">Clientes em espera</span>
                    <strong>{clientesEmEspera}</strong>
                </article>
            </div>

            <div className="painel-bloco">
                <h2>Resumo por categoria</h2>
                <div className="painel-tabela-moldura">
                    <table className="tabela painel-tabela">
                        <thead>
                            <tr>
                                <th>Categoria</th>
                                <th>Valor em estoque</th>
                                <th>Unidades</th>
                                <th>Lucro estimado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resumoPorCategoria.map((categoria) => (
                                <tr key={categoria.id}>
                                    <td>{categoria.nome}</td>
                                    <td>{formatarPreco(categoria.valorEstoque)}</td>
                                    <td>{categoria.unidades}</td>
                                    <td>{formatarPreco(categoria.lucroEstimado)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="painel-bloco painel-dupla">
                <div>
                    <h2>Esperando preço do time de suprimentos</h2>
                    {produtosSemPreco.length > 0 ? (
                        <ul className="painel-lista">
                            {produtosSemPreco.map((produto) => (
                                <li key={produto.id}>
                                    <span>{produto.title}</span>
                                    <small>{produto.estoque} em estoque</small>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="painel-vazio">Nenhum produto está aguardando definição de preço.</p>
                    )}
                </div>

                <div>
                    <h2>Clientes aguardando retorno</h2>
                    {produtosEsgotados.length > 0 ? (
                        <ul className="painel-lista">
                            {produtosEsgotados.map((produto) => (
                                <li key={produto.id}>
                                    <span>{produto.title}</span>
                                    <small>{produto.estoque === 0 ? 'Sem estoque no momento' : `${produto.estoque} disponíveis`}</small>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="painel-vazio">Nenhum produto está esgotado no momento.</p>
                    )}
                </div>
            </div>
        </section>
    )
}
