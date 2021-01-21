import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa'

import api from '../../services/api'

import { Container, Owner, Loading, BackButton, IssuesList, PageActions, FilterList } from './styles';

function Repositorio({ match }) {
  const [repositorio, setRepositorio] = useState({})
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState([
    {state: 'all', label: 'Todas', active: true},
    {state: 'open', label: 'Abertas', active: false},
    {state: 'closed', label: 'Fechadas', active: false},
  ])
  const [filterIndex, setFilterIndex] = useState(0)

  useEffect(() => {
    async function load() {
      // Fazer a decodificação do parametro enviado pela url
      const nameRepo = decodeURIComponent(match.params.repositorio)

      // Fazer requisições simultaneas, salvar em um array e descontruir
      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${nameRepo}`),
        api.get(`repos/${nameRepo}/issues`, {
          params: {
            state: filters.find(f => f.active).state,
            per_page: 5
          }
        })
      ])
      setRepositorio(repositorioData.data)
      setIssues(issuesData.data)
      setLoading(false)
    }

    load()
  }, [match.params.repositorio])

  useEffect(() => {
    async function loadIssue(){
      // Fazer a decodificação do parametro enviado pela url
      const nameRepo = decodeURIComponent(match.params.repositorio)

      const response = await api.get(`/repos/${nameRepo}/issues`, {
        params: {
          state: filters[filterIndex].state,
          page,
          per_page: 5,
        }
      })
      setIssues(response.data)
    }

    loadIssue()

  },[match.params.repositorio, page, filters, filterIndex])

  function handlePage(action){
    setPage(action === 'back' ? page - 1 : page + 1 )
  }

  function handleFilter(index){
    setFilterIndex(index)
  }

  if (loading) {
    return (
      <Loading>
        <FaSpinner color="#fff" size={80}/>
      </Loading>
    )
  }
  return (
    <Container>
      <BackButton to="/">
        <FaArrowLeft color="#000" size={35} />
      </BackButton>
      <Owner>
        <img
          src={repositorio.owner.avatar_url}
          alt={repositorio.owner.login}
        />
        <h1>{repositorio.name}</h1>
        <p>{repositorio.description}</p>
      </Owner>

      <FilterList active={filterIndex}>
        {filters.map((filter, index) => (
          <button
            type="button"
            key={filter.label}
            onClick={() => handleFilter(index)}
          >
            {filter.label}
          </button>
        ))}
      </FilterList>

      <IssuesList>
        {issues.map(issue => (
          <li key={String(issue.id)}>
            <img
              src={issue.user.avatar_url}
              alt={issue.user.login}
            />

            <div>
              <strong>
                <a href={issue.html_url} target="_blank">{issue.title}</a>

                {issue.labels.map(label => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
              </strong>

              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </IssuesList>

      <PageActions>
        <button
          type="button"
          disabled={page < 2}
          onClick={() => handlePage('back')}
        >
          Voltar
        </button>

        <button
          type="button"
          onClick={() => handlePage('next')}
        >
          Próxima
        </button>
      </PageActions>
    </Container>
  )
}

export default Repositorio;