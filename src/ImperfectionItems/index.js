import React from 'react'
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components'
import ImperfectionItem from './ImperfectionItem'
import NewImperfectionItem from './NewImperfectionItem'

const IMPERFECTION_ITEMS = gql`
{
  imperfectionItems {
    id
    sortOrdinal
    internalDescription
    type {
      id
      name
      description
      location {
        id
        name
      }
    }
  }
}
`;

const Container = styled.div`
width: 1000px;
display: grid;
grid-template-rows: 1fr 1fr 1fr;
grid-template-columns: 1fr 1fr 1fr;
grid-gap: 20px;
`

const ImperfectionItems = () => {
  const { data, error, loading, refetch } = useQuery(IMPERFECTION_ITEMS)

  return (
    <Container>
      {error && (<div>Error! {error}</div>)}
      {loading && (<div>Loading...</div>)}
      <NewImperfectionItem refetch={refetch} />
      {data && data.imperfectionItems
      .map(imperfectionItem => <ImperfectionItem imperfectionItem={imperfectionItem} refetch={refetch} key={`imperfectionItem${imperfectionItem.id}`}/>)}
    </Container>
  )
}

export default ImperfectionItems
