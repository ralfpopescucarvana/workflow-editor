import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import TypeItem from './TypeItem'

const Container = styled.div`
display: grid;
grid-template-columns: 320px 320px 320px;
grid-auto-rows: 320px;
grid-gap: 20px;
`

const TypeItems = ({ types }) => {
  const {  subTypeId: stringSubTypeId } = useParams()
  const subTypeId = parseInt(stringSubTypeId)
  return (
  <Container>
    {types.find(type => type.id === subTypeId).items.map(item => <TypeItem item={item} />)}
  </Container>
)}

export default TypeItems