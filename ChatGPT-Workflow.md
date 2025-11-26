"What kind of pokemons will help me to _ ?"  (user fills in the blank) -> A button "Find out!" is pressed -> A prompt is constructed -> Prompt is sent to OpenAI ->
Extract pokemon names from the answer -> Call PokeAPI database to fetch images of these pokemon -> Display pokemon names and pokemon pictures 


End-to-end workflow (simplified ver.):

User enters text -> presses Enter -> request is sent to the backend where the OpenAI API key is stored ->
request is sent to OpenAI servers -> response is parsed and sent to the frontend -> the response is 
displayed on the website below the box