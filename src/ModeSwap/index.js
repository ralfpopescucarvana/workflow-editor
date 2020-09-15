import React from 'react';
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'

const Container = styled.div`
display: flex;
flex-direction: column;
`

const ModeButtonContainer = styled(Link)`
background-color: ${({ isActive}) => isActive ? 'red' : 'black'};
color: white;
padding: 20px;
border-radius: 8px;
`

const ModeSwap = () => {
  const imperfectionReferenceActive = useRouteMatch('/imperfectionreference')
  const workflowsActive = useRouteMatch('/workflows')
  return (
  <Container>
    <ModeButtonContainer to="/imperfectionreference" isActive={imperfectionReferenceActive}>
      Imperfection Reference
    </ModeButtonContainer>
    <ModeButtonContainer to="/workflows" isActive={workflowsActive}>
      Workflows
    </ModeButtonContainer>
  </Container>
)}

export default ModeSwap