import React from 'react'
import styled from 'styled-components'
import { Link, useRouteMatch, useParams } from 'react-router-dom'


const Container = styled.div`
display: flex;
flex-direction: column;
width: 200px;
`

const TypeContainer = styled(Link)`
background-color: ${({ isActive}) => isActive ? 'red' : 'black'};
color: white;
padding: 20px;
border-radius: 8px;
margin-bottom: 8px;
`

const Type = ({ type, to }) => {
  const isActive = useRouteMatch(to)
  return (
    <TypeContainer to={to} isActive={isActive}>
      {type.name}
    </TypeContainer>
  )
}

const Types = ({ types }) => {
  const { parentId: stringParentId } = useParams()
  const parentId = parseInt(stringParentId)
  let typesToMap = types;

  if(parentId) {
    typesToMap = types.filter(type => {
      return type.parentType?.id === parentId
    })
  }
  return (
  <Container>
    {typesToMap.map(type => <Type type={type} to={`/workflows${parentId ? `/${parentId}` : ''}/${type.id}`}/>)}
  </Container>
)}

export default Types