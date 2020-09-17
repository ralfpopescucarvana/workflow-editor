import React, { useState } from 'react'
import styled from 'styled-components'
import { gql, useMutation } from '@apollo/client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useParams } from 'react-router-dom'

const CREATE_GENERIC_FEATURE = gql`
mutation CreateGenericFeature($input: CreateGenericFeatureInput!) {
  createGenericFeature(input: $input) {
    id
    name
    description
    location {
      id
      name
    }
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

const CREATE_WORKFLOW_ITEM = gql`
mutation CreateWorkflowItem($input: CreateWorkflowItemInput!) {
  createWorkflowItem(input: $input) {
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

const Button = styled.button`
outline: none;
border: none;
background-color: none;
align-items: center;
padding: none;
justify-content: center;
cursor: pointer;
`

const StyledErrorMessage = styled(ErrorMessage)`
color: red;
`

const Errors = styled.div`
color: red;
`

const PointsContainer = styled.div`
border-radius: 50%;
padding: 6px;
font-size: 8px;
align-items: center;
justify-content: center;
align-text: center;
margin-right: 8px;
color: white;
width: 8px;
height: 8px;
background-color: purple;
`

const NewTypeItem = ({refetch }) => {
  const [createGenericFeature, { loading: creatingGenericFeature }] = useMutation(CREATE_GENERIC_FEATURE);
  const [updateExamplePhoto, { loading: updatingExamplePhoto }] = useMutation(INSERT_EXAMPLE_PHOTO_FILE);
  const [createWorkflowItem, { loading: creatingWorkflowItem }] = useMutation(CREATE_WORKFLOW_ITEM);
  const [errs, setErrs] = useState()
  const { subTypeId: stringSubTypeId } = useParams()
  const typeId = parseInt(stringSubTypeId)

  return (
  <Container>
    <Formik
    initialValues={{}}
    validate={values => {
      console.log('validate', values)
      const errors = {};
      if (!values.name) {
        errors.name = 'Required ^';
      }
      if (!values.points) {
        errors.points = 'Required ^';
      }
      return errors;
    }}
    onSubmit={async ({ name, description, points, url, locationId }, { setSubmitting, resetForm }) => {
      console.log(name, description, points, url, locationId)
      try {
        const { data: { createGenericFeature: genericFeature } } = await createGenericFeature({ variables: { input: { name, description, locationId }}})
        if(url) {
          console.log('generiffeature', genericFeature)
          await updateExamplePhoto({ variables: { input: { genericFeatureId: genericFeature.id, payload: { url }}}})
        }
        await createWorkflowItem({ variables: { input: { typeId, points, genericFeatureId: genericFeature.id }}})
        await refetch()
        setErrs(null)
        setSubmitting(false)
      } catch (e) {
        setErrs(e)
      }
      
    }}
  >
    {({ isSubmitting, errors }) => (
      <>
      {creatingGenericFeature || creatingWorkflowItem || updatingExamplePhoto ? <div>Creating...</div> : (
        <StyledForm>
        <NameRow>
        <Name>New workflow item</Name>
      </NameRow>
        <StyledField type="text" name="name" label="name" placeholder="Name"/>
        <StyledErrorMessage name="name" component="div" />
        <StyledField component="textarea" name="description" placeholder="Description"/>
        <StyledErrorMessage name="description" component="div" />
        <StyledField type="text" name="url" placeholder="Example Photo Url"/>
        <StyledErrorMessage name="url" component="div" />
        <StyledField type="text" name="points" placeholder="Points"/>
        <StyledErrorMessage name="points" component="div" />
        <Field as="select" name="locationId" placeholder="Location">
            <option value={null}>Choose location</option>
             <option value="0">Exterior</option>
             <option value="1">Interior</option>
             <option value="2">Glass</option>
           </Field>
           <StyledErrorMessage name="locationId" component="div" />
        <Button type="submit" disabled={isSubmitting || Object.keys(errors).length > 0}>
          Add
        </Button>
    <Errors>{errs && `${JSON.stringify(errs)}`}</Errors>

      </StyledForm>
      )}
      </>
    )}
    </Formik>
</Container>
)}



export default NewTypeItem
