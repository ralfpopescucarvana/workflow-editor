import React from 'react';
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'

const Container = styled.div`
display: flex;
flex-direction: column;
`

const ModeButtonContainer = styled(Link)`
background-color: ${({ isActive}) => isActive ? 'rgb(0, 174, 217)' : '#f6f6f6'};
color: ${({ isActive}) => isActive ? 'white' : 'inherit'};
font-size: 32px;
text-decoration: none;
padding: 20px;
border-radius: 8px;
margin-bottom: 16px;
`

const ModeSwap = () => {
  const imperfectionReferenceActive = useRouteMatch('/imperfectionreference')
  const workflowsActive = useRouteMatch('/workflows')
  return (
  <Container>
    <ModeButtonContainer to="/imperfectionreference" isActive={imperfectionReferenceActive}>
      Imperfections
    </ModeButtonContainer>
    <ModeButtonContainer to="/workflows" isActive={workflowsActive}>
      Workflows
    </ModeButtonContainer>
  </Container>
)}

export default ModeSwap