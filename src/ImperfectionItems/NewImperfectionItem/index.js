import React, { useState } from 'react'
import styled from 'styled-components'
import { gql, useMutation } from '@apollo/client';
import { Formik, Form, Field, ErrorMessage } from 'formik';


const CREATE_IMPERFECTION_ITEM = gql`
mutation CreateImperfectionItem($input: CreateImperfectionItemInput!) {
      createImperfectionItem(input: $input) {
        id
        type {
          name
          description
        }
    }
}
`

const Container = styled.div`
display: flex;
flex-direction: column;
background-color: #f6f6f6;
width: 240px;
border-radius: 8px;
padding: 16px;
`

const Button = styled.button`
outline: none;
border: none;
padding: 8px;
color: white;
background-color: ${({ disabled }) => disabled ? 'grey' : 'rgb(0, 174, 217)'};
align-items: center;
padding: none;
cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
justify-content: center;
margin-top: 8px;

`

const NameRow = styled.div`
margin-bottom: 6px;
display: flex;
flex-direction: row;
`

const Name = styled.div`
font-weight: 800;
flex-grow: 1;
`


const StyledForm = styled(Form)`
display: flex;
flex-direction: column;
`

const StyledField = styled(Field)`
margin-bottom: 8px;
`

const StyledErrorMessage = styled(ErrorMessage)`
color: red;
`

const Errors = styled.div`
color: red;
`


const NewImperfectionItem = ({ refetch }) => {
  const [createImperfectionItem, { loading }] = useMutation(CREATE_IMPERFECTION_ITEM, { onCompleted: refetch });
  const [errs, setErrs] = useState()
  return (
  <Container>
    <Formik
    initialValues={{}}
    validate={values => {
      const errors = {};
      if (!values.name) {
        errors.name = 'Required';
      }
      if (!values.sortOrdinal) {
        errors.sortOrdinal = 'Required';
      }
      if (!values.locationId) {
        errors.locationId = 'Required';
      }
      return errors;
    }}
    onSubmit={async ({ name, description, internalDescription, sortOrdinal, locationId }, { setSubmitting, setFieldValue, setErrors }) => {
      try {
        createImperfectionItem({ variables: { input: { name, description, sortOrdinal, internalDescription, locationId, inventoryTypeId: 1 }}})
        setSubmitting(false)
        setFieldValue('name', null)
        setFieldValue('description', null)
        setFieldValue('internalDescription', null)
        setFieldValue('sortOrdinal', null)
        setFieldValue('locationId', null)
        setErrors({})
      } catch (e) {
        setErrs(e)
      }
    }}
  >
    {({ isSubmitting, errors }) => (
      <>
      {loading ? <div>Adding...</div> : (
          <StyledForm>
          <NameRow>
          <Name>New imperfection item</Name>
        </NameRow>
          Name
          <StyledField type="text" name="name" label="name" placeholder="Name" />
          <StyledErrorMessage name="name" component="div" />
          Description
          <StyledField component="textarea" name="description" placeholder="Description" />
          <StyledErrorMessage name="description" component="div" />
          Internal Description
          <StyledField component="textarea" name="internalDescription" placeholder="Internal Description" />
          <StyledErrorMessage name="internalDescription" component="div" />
          Order
          <StyledField type="text" name="sortOrdinal" placeholder="Order"/>
          <StyledErrorMessage name="sortOrdinal" component="div" />
          <Field as="select" name="locationId">
              <option value={null}>Choose location</option>
               <option value="0">Exterior</option>
               <option value="1">Interior</option>
               <option value="2">Glass</option>
             </Field>
             <StyledErrorMessage name="locationId" component="div" />
          <Button type="submit" disabled={isSubmitting || Object.keys(errors).length > 0}>
            Add
          </Button>
      {errs && <Errors>{JSON.stringify(errs)}</Errors>}
        </StyledForm>
          )}</>
    )}
  </Formik>
  </Container>
)}

export default NewImperfectionItem