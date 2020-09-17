import React from 'react'
import styled from 'styled-components'
import { Link, useRouteMatch, useParams } from 'react-router-dom'


const Container = styled.div`
display: flex;
flex-direction: column;
width: 200px;
`

const TypeContainer = styled(Link)`
background-color: ${({ isActive}) => isActive ? 'rgb(0, 174, 217)' : '#f6f6f6;'};
color: ${({ isActive}) => isActive ? 'white' : 'inherit'};
padding: 20px;
text-decoration: none;
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

const getLink = (parentId, type, types) => {
  if(parentId) {
    return `/workflows/${parentId}/${type.id}`
  }

  const children = type.items
  const hasChildren = children.length > 0
  console.log(parentId, type.name, children)

  if(hasChildren && !type.parentType) {
    return `/workflows/${type.id}/${type.id}`
  }
  return `/workflows/${type.id}`
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
    {typesToMap.map(type => <Type type={type} to={getLink(parentId, type, types)}/>)}
  </Container>
)}

export default Types