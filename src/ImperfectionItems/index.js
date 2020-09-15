import React from 'react'
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components'
import ImperfectionItem from './ImperfectionItem'

const IMPERFECTION_ITEMS = gql`
{
  imperfectionItems {
    type {
      id
      name
      description
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
  const { data, error, loading } = useQuery(IMPERFECTION_ITEMS)

  return (
    <Container>
      {error && (<div>Error! {error}</div>)}
      {loading && (<div>Loading...</div>)}
      {data && data.imperfectionItems
      .map(imperfectionItem => <ImperfectionItem imperfectionItem={imperfectionItem}/>)}
    </Container>
  )
}

export default ImperfectionItems
