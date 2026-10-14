import { useState } from 'react'
import { Link, useParams } from 'react-router'

export default function PaginaProduto({ produtos, onAdicionar, onRegistrarEspera }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const precoValido = Number.isFinite(Number(produto.price))
  const esgotado = produto.estoque === 0
  const relacionados = produtos
    .filter(
      (item) => item.category === produto.category && item.id !== produto.id && Number.isFinite(Number(item.price))
    )
    .slice(0, 4)

  function enviarEspera(evento) {
    evento.preventDefault()
    const foiRegistrado = onRegistrarEspera?.(produto.id, nome, email)

    if (foiRegistrado) {
      setMensagem('Você foi adicionado à lista de espera. Vamos avisar quando voltar!')
      setNome('')
      setEmail('')
    } else {
      setMensagem('Preencha nome e e-mail para receber o aviso.')
    }
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">
            {precoValido ? `R$ ${Number(produto.price).toFixed(2).replace('.', ',')}` : 'Preço em breve'}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>

          {!esgotado ? (
            <button
              className="botao botao-grande"
              onClick={() => onAdicionar(produto)}
              disabled={!precoValido}
            >
              {precoValido ? 'Adicionar ao carrinho' : 'Preço indisponível'}
            </button>
          ) : (
            <div className="lista-espera-box">
              <p className="lista-espera-titulo">Produto esgotado</p>
              <form className="lista-espera-form" onSubmit={enviarEspera}>
                <input
                  type="text"
                  value={nome}
                  onChange={(evento) => setNome(evento.target.value)}
                  placeholder="Seu nome"
                  aria-label="Nome"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                  placeholder="Seu e-mail"
                  aria-label="E-mail"
                />
                <button type="submit" className="botao botao-grande">
                  Avise-me quando voltar
                </button>
              </form>
              {mensagem && <p className="mensagem-espera">{mensagem}</p>}
            </div>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">R$ {Number(item.price).toFixed(2).replace('.', ',')}</p>
            <button className="botao" onClick={() => onAdicionar(item)} disabled={item.estoque === 0}>
              Adicionar ao carrinho
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
