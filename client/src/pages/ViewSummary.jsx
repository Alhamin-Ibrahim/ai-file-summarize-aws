import React, { useState, useEffect } from 'react';
import { Container, VStack, Heading, Box, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';

const ViewSummary = () => {
  const [summary, setSummary] = useState('');
  const [fetchingData, setFetchingData] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSummary = async () => {
      const key = new URLSearchParams(window.location.search).get('key');
      if (!key) {
        setSummary("No key provided in URL.");
        setFetchingData(false);
        return;
      }

      try {
        const response = await fetch(import.meta.env.VITE_SUMMARIZE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key })
        });

        const data = await response.json();
        setSummary(data.summary || "No summary returned.");
      } catch (error) {
        console.error("Error fetching summary:", error);
        setSummary("An error occurred while fetching the summary.");
      } finally {
        setFetchingData(false);
      }
    };

    fetchSummary();
  }, []);

  const homePage = () => {
    navigate('/')
  }

  return (
    <Container maxW={'container.sm'}>
            <VStack spacing={8}>
                <Heading color={'black'} as={'h1'} size={'2xl'} textAlign={'center'} mb={8} onClick={homePage}>
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
                {fetchingData ? <Text color={'black'}>Loading...</Text> : <Text color={'black'}>{summary}</Text>}       
                </Box>
            </VStack>
      </Container>
  );
};

export default ViewSummary;
