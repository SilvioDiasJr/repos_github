import React, { useEffect, useState } from 'react';

import api from '../../services/api'

import { Container } from './styles';

function Repositorio({match}) {
  const [repositorio, setRepositorio] = useState({})
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load(){
      // Fazer a decodificação do parametro enviado pela url
      const nameRepo = decodeURIComponent(match.params.repositorio)

      // Fazer requisições simultaneas, salvar em um array e descontruir
      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${nameRepo}`),
        api.get(`repos/${nameRepo}/issues`, {
          params:{
            state: 'open',
            per_page: 5
          }
        })
      ])
      setRepositorio(repositorioData.data)
      setIssues(issuesData.data)
      setLoading(false)
    }

    load()
  },[match.params.repositorio])
  return (
    <Container>

    </Container>
  )
}

export default Repositorio;