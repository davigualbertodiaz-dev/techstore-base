import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import Estoque from './pages/Estoque'
import PainelLogista from './pages/PainelLogista'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)
  const [listaEspera, setListaEspera] = useState([])

  useEffect(() => {
    buscarProdutos()
      .then((dados) => setProdutos(dados))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)
      if (dados.length > 0) setClienteAtualId(dados[0].id)
    })
  }, [])

  function adicionarAoCarrinho(produto) {
    setCarrinho(carrinho.concat(produto))
  }

  function removerUmaUnidade(produtoId) {
    // Remove só a primeira unidade encontrada do produto
    let removido = false
    setCarrinho(
      carrinho.filter((produto) => {
        if (!removido && produto.id === produtoId) {
          removido = true
          return false
        }
        return true
      })
    )
  }

  function registrarEspera(produtoId, nome, email) {
    const nomeFormatado = nome.trim()
    const emailFormatado = email.trim().toLowerCase()

    if (!nomeFormatado || !emailFormatado) return false

    setListaEspera((atual) => {
      const jaExiste = atual.some(
        (item) => item.produtoId === produtoId && item.email.toLowerCase() === emailFormatado
      )

      if (jaExiste) return atual

      return [...atual, { produtoId, nome: nomeFormatado, email: emailFormatado }]
    })

    return true
  }

  const clienteAtual = clientes.find((cliente) => cliente.id === clienteAtualId)

  return (
    <div className="app">
      <RolarParaTopo />
      <Header carrinho={carrinho} clienteAtual={clienteAtual} />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}

        {!carregando && !erro && (
          <Routes>
            <Route
              path="/"
              element={<Loja produtos={produtos} onAdicionar={adicionarAoCarrinho} />}
            />
            <Route
              path="/produto/:id"
              element={
                <PaginaProduto
                  produtos={produtos}
                  onAdicionar={adicionarAoCarrinho}
                  onRegistrarEspera={registrarEspera}
                />
              }
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                />
              }
            />
            <Route
              path="/painel-logista"
              element={<PainelLogista produtos={produtos} listaEspera={listaEspera} />}
            />
            <Route
              path="/painel-de-logista"
              element={<PainelLogista produtos={produtos} listaEspera={listaEspera} />}
            />
            <Route path="/estoque" element={<Estoque produtos={produtos} listaEspera={listaEspera} />} />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientes}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={setClienteAtualId}
      />
    </div>
  )
}
