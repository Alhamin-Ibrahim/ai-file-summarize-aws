import { Container, VStack, Heading, Box, Input, Button, Text } from '@chakra-ui/react'
import React, {useRef, useState} from 'react'
import { HiUpload } from "react-icons/hi"
import {useNavigate} from 'react-router-dom'

const InputForm = () => {
    const [file, setFile] = useState()
    const fileInputRef = useRef()
    const navigate = useNavigate()

    const handleRequest = async () => {
        if (!file) {
          alert("Please enter a file")
          return
        }
    
        try {
          const res = await fetch(import.meta.env.VITE_UPLOAD_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: file.name, fileType: file.type }),
          })
    
          if (!res.ok) {
            const errorText = await res.text()
            throw new Error(errorText || 'Failed to get upload URL')
          }
    
          const { uploadUrl, key } = await res.json()
          await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file,
          })

          navigate(`/summary?key=${encodeURIComponent(key)}`);
    
        } catch (error) {
          console.error('Upload error:', error)
          alert('Something went wrong')
        }
      }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
          setFile(selectedFile);
        }
      };

      const handleClick = () => {
        fileInputRef.current.click();
      };

  return (
    <Container maxW={'container.sm'}>
        <VStack spacing={8}>
            <Heading color={'black'} as={'h1'} size={'2xl'} textAlign={'center'} mb={8}>
                Cloud Summerize
            </Heading>

            <Box
            w={'50%'}
            bg={'gray.100'}
            //color={'black'}
            p={6}
            //spacing={12}
            rounded={'lg'}
            shadow={'md'}
            >

                <Input
                    type="file"
                    accept=".txt,.pdf,.docx"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    display="none"
                />

                <Button leftIcon={<HiUpload />} onClick={handleClick} variant="outline" color={'black'}>
                    Upload File
                </Button> 
                <Text color={'black'}>Files accepted: .pdf, .docx and .txt</Text>

                {file && (
                    <Text mt={2} fontSize="sm" color="gray.600">
                    Selected: {file.name}
                    </Text>
                )}

                <Button colorScheme='blue' onClick={handleRequest} w={'full'}>
                    Submit
                </Button>
            </Box>
        </VStack>
    </Container>
  )
}

export default InputForm
