import React from 'react'
import styled from 'styled-components'
import { ReactComponent as TrashIcon } from '../../../assets/delete.svg'

const Container = styled.div`
display: flex;
flex-direction: column;
border-radius: 8px;
background-color: #f6f6f6;
padding: 16px;
`

const Name = styled.div`
font-size: 24px;
flex-grow: 1;
`

const Description = styled.div``

const ExamplePhoto = styled.img`
height: 170px;
width: 280px;
`

const PhotoContainer = styled.div`
display: flex;
flex-grow: 1;
align-items: center;
justify-content: center;
`

const StyledTrashIcon = styled(TrashIcon)`
height: 20px;
width: 20px;
`

const TitleRow = styled.div`
display: flex;
flex-direction: row;
`

const TypeItem = ({ item }) => (
  <Container>
    <TitleRow>
      <Name>{item.genericFeature.name}</Name>
      <StyledTrashIcon />
    </TitleRow>
    <Description>{item.genericFeature.description}</Description>
    {console.log(item.genericFeature.examplePhotoFile?.url)}
    <PhotoContainer>
      <ExamplePhoto src={item.genericFeature.examplePhotoFile?.url} />
    </PhotoContainer>
    </Container>
)

export default TypeItem
