import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createCustomer } from 'apiSdk/customers';
import { Error } from 'components/error';
import { customerValidationSchema } from 'validationSchema/customers';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { BankInterface } from 'interfaces/bank';
import { getBanks } from 'apiSdk/banks';
import { CustomerInterface } from 'interfaces/customer';

function CustomerCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CustomerInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCustomer(values);
      resetForm();
      router.push('/customers');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CustomerInterface>({
    initialValues: {
      credit_amount: 0,
      debit_loan: 0,
      due_date_emi: new Date(new Date().toDateString()),
      bank_id: (router.query.bank_id as string) ?? null,
    },
    validationSchema: customerValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Customer
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="credit_amount" mb="4" isInvalid={!!formik.errors?.credit_amount}>
            <FormLabel>Credit Amount</FormLabel>
            <NumberInput
              name="credit_amount"
              value={formik.values?.credit_amount}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('credit_amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.credit_amount && <FormErrorMessage>{formik.errors?.credit_amount}</FormErrorMessage>}
          </FormControl>
          <FormControl id="debit_loan" mb="4" isInvalid={!!formik.errors?.debit_loan}>
            <FormLabel>Debit Loan</FormLabel>
            <NumberInput
              name="debit_loan"
              value={formik.values?.debit_loan}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('debit_loan', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.debit_loan && <FormErrorMessage>{formik.errors?.debit_loan}</FormErrorMessage>}
          </FormControl>
          <FormControl id="due_date_emi" mb="4">
            <FormLabel>Due Date Emi</FormLabel>
            <Box display="flex" maxWidth="100px" alignItems="center">
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.due_date_emi ? new Date(formik.values?.due_date_emi) : null}
                onChange={(value: Date) => formik.setFieldValue('due_date_emi', value)}
              />
              <Box zIndex={2}>
                <FiEdit3 />
              </Box>
            </Box>
          </FormControl>
          <AsyncSelect<BankInterface>
            formik={formik}
            name={'bank_id'}
            label={'Select Bank'}
            placeholder={'Select Bank'}
            fetcher={getBanks}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'customer',
  operation: AccessOperationEnum.CREATE,
})(CustomerCreatePage);
