import React, { useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as TrashIcon } from '../../../assets/delete.svg'
import { ReactComponent as EditIcon } from '../../../assets/edit.svg'
import { ReactComponent as Check } from '../../../assets/correct.svg'
import { ReactComponent as Close } from '../../../assets/close.svg'
import { gql, useMutation } from '@apollo/client';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const DELETE_WORKFLOW_ITEM = gql`
mutation DeleteWorkflowItem($id: Int!) {
    deleteWorkflowItem(id: $id) {
        id
    }
}
`

const INSERT_EXAMPLE_PHOTO_FILE = gql`
mutation InsertExamplePhotoFileToGenericFeature($input: InsertExamplePhotoFileToGenericFeatureInput!) {
    insertExamplePhotoFileToGenericFeature(input: $input) {
    		id
        examplePhotoFile {
          id
          url
        }
    }
  }
`

const UPDATE_GENERIC_FEATURE = gql`
mutation UpdateGenericFeature($input: UpdateGenericFeatureInput!) {
  updateGenericFeature(input: $input) {
    id
    name
    description
  }
}
`

const UPDATE_WORKFLOW_ITEM = gql`
mutation UpdateWorkflowItem($input: UpdateWorkflowItemInput!) {
  updateWorkflowItem(input: $input) {
    id
    points
  }
}
`


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
cursor: pointer;
margin-left: 12px;

&:hover {
  opacity: 0.7; 
}
`

const StyledEditIcon = styled(EditIcon)`
height: 20px;
width: 20px;
cursor: pointer;

&:hover {
  opacity: 0.7; 
}
`

const TitleRow = styled.div`
display: flex;
flex-direction: row;
`

const NameRow = styled.div`
margin-bottom: 6px;
display: flex;
flex-direction: row;
`

const StyledForm = styled(Form)`
display: flex;
flex-direction: column;
`

const StyledField = styled(Field)`
margin-bottom: 8px;
`

const StyledCheckIcon = styled(Check)`
height: 20px;
width: 20px;
cursor: pointer;

&:hover {
  opacity: 0.7; 
}
`


const StyledCloseIcon = styled(Close)`
height: 16px;
width: 16px;
cursor: pointer;
margin-left: 12px;

&:hover {
  opacity: 0.7; 
}
`


const Button = styled.button`
outline: none;
border: none;
background-color: none;
align-items: center;
padding: none;
justify-content: center;
cursor: pointer;
`

const SureButton = styled.button`
color: white;
background-color: green;
border: none;
border-radius: 8px;
padding: 8px;
width: 80px;
margin-right: 16px;
cursor: pointer;
`

const NotSureButton = styled.button`
color: white;
background-color: red;
border: none;
border-radius: 8px;
padding: 8px;
width: 80px;
cursor: pointer;
`

const ButtonRow = styled.div`
display: flex;
flex-direction: row;
flex-grow: 1;
align-items: center;
justify-content: center;
`

const PointsContainer = styled.div`
display: flex;
border-radius: 50%;
padding: 6px;
font-size: 12px;
align-items: center;
justify-content: center;
align-text: center;
margin-right: 8px;
color: white;
width: 8px;
height: 8px;
background-color: purple;
`

const TypeItem = ({ item, refetch }) => {
  const [deleteWorkflowItem, { loading: deleting }] = useMutation(DELETE_WORKFLOW_ITEM, { onCompleted: () => refetch()});
  const [updateWorkflowItem, { loading: updatingWorkflow }] = useMutation(UPDATE_WORKFLOW_ITEM);
  const [updateGenericFeature, { loading: updatingGenericFeature }] = useMutation(UPDATE_GENERIC_FEATURE);
  const [updateExamplePhoto, { loading: updatingExamplePhoto }] = useMutation(INSERT_EXAMPLE_PHOTO_FILE);
  const [mode, setMode] = useState('DEFAULT')
  return (
  <Container>
    {mode === 'DEFAULT' && 
    <>
    <TitleRow>
      <PointsContainer>{item.points}</PointsContainer>
      <Name>{item.genericFeature.name}</Name>
      <StyledEditIcon onClick={() => setMode('EDIT')}/>
      <StyledTrashIcon onClick={() => setMode('DELETE')}/>
    </TitleRow>
    <Description>{item.genericFeature.description}</Description>
    {console.log(item.genericFeature.examplePhotoFile?.url)}
    <PhotoContainer>
      <ExamplePhoto src={item.genericFeature.examplePhotoFile?.url} />
    </PhotoContainer>
    </>
    }
    {mode === 'DELETE' && 
    <>
    <Name>
    Are you sure?
    </Name>
    <ButtonRow>
      <SureButton onClick={() => {
        deleteWorkflowItem({ variables: { id: item.id } })
        setMode('DEFAULT')
      }}>Yes!</SureButton>
      <NotSureButton onClick={() => setMode('DEFAULT')}>Not sure</NotSureButton>
    </ButtonRow>
    </>
    }
    {mode === 'EDIT' && (
    <Formik
    initialValues={{ 
      name: item.genericFeature.name, 
      description: item.genericFeature.description, 
      points:  item.points,
      url: item.genericFeature.examplePhotoFile.url
    }}
    validate={values => {
      const errors = {};
      if (!values.name) {
        errors.name = 'Required';
      }
      if (!values.description) {
        errors.description = 'Required';
      }
      if (!values.points) {
        errors.points = 'Required';
      }
      if (!values.url) {
        errors.url = 'Required';
      }
      return errors;
    }}
    onSubmit={async ({ name, description, points, url }, { setSubmitting }) => {
      await updateWorkflowItem({ variables: { input: { id: item.id, payload: { points }}}})
      await updateGenericFeature({ variables: { input: { id: item.genericFeature.id, payload: { name, description }}}})
      await updateExamplePhoto({ variables: { input: { genericFeatureId: item.genericFeature.id, payload: { url }}}})
      setSubmitting(false)
      setMode('DEFAULT')
    }}
  >
    {({ isSubmitting }) => (
      <>
      {updatingWorkflow || updatingGenericFeature || updatingExamplePhoto ? <div>Updating...</div> : (
        <StyledForm>
        <NameRow>
        <Name>Edit mode - this will edit the item for all cars.</Name>
        <Button type="submit" disabled={isSubmitting}>
          <StyledCheckIcon />
        </Button>
        <Button onClick={() => setMode('DEFAULT')}>
          <StyledCloseIcon />
        </Button>
      </NameRow>
        Name
        <StyledField type="text" name="name" label="name" />
        <ErrorMessage name="name" component="div" />
        Description
        <StyledField component="textarea" name="description" />
        <ErrorMessage name="description" component="div" />
        Points
        <StyledField component="text" name="points" />
        <ErrorMessage name="points" component="div" />
        Example Photo Url
        <StyledField type="text" name="url" />
        <ErrorMessage name="url" component="div" />
      </StyledForm>
      )}
      </>
    )}
    </Formik>
    )}
</Container>
)}




export default TypeItem
