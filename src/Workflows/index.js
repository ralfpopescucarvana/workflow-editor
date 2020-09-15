import React from 'react'
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components'
import Types from './Types'
import TypeItems from './TypeItems'
import { Route } from 'react-router-dom'

const WORKFLOW = gql`
{
  workflow {
    types {
      id
      name
      parentType {
        id
        name
      }
      items {
        id
        genericFeature {
          id
          name
          description
          examplePhotoFile {
            id
            url
          }
        }
      }
    }
  }
}
`;

const Container = styled.div`
width: 1000px;
display: grid;
grid-template-rows: 1fr 1fr 1fr;
grid-template-columns: 200px 200px 1fr;
grid-gap: 20px;
`

const Workflows = () => {
  const { data, error, loading } = useQuery(WORKFLOW)
  return (
    <Container>
      {error && (<div>Error! {error}</div>)}
      {loading && (<div>Loading...</div>)}
      {data && <Types types={data.workflow.types.filter(type => type.parentType === null)} />}
      <Route path="/workflows/:parentId">
       {data && <Types types={data.workflow.types} />}
      </Route>
      <Route path="/workflows/:parentId/:subTypeId">
       {data && <TypeItems types={data.workflow.types} />}
      </Route>
    </Container>
  )
}

export default Workflows
