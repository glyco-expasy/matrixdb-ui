# MatrixDB Web Portal

MatrixDB is a curated interaction database focused on experimentally supported interactions mediated by components of the extracellular matrix (ECM), including proteins, proteoglycans, glycosaminoglycans, and bioactive ECM fragments collectively referred to as matrikines or matricryptins. This web portal provides an interactive interface to explore and visualize ECM-related interactions using modern web technologies.

## Features

- **Search Engine**: 
  - **Basic Mode**: Provides a Solr-based free text search to search for biomolecules and publications.
  - **Advanced Mode**: Allows for more granular searches using specific keywords.

- **Interactive Network Visualizations**: Explore ECM-mediated interactions of a given biomolecule through interactive graphs powered by [Cytoscape.js](https://cytoscape.org/cytoscape.js/).

- **3D structure visualization for proteins and glycoaminoglycans**: 3D structure visualizations powered by [Mol-*](https://molstar.org/)

- **[Network Explorer](https://matrixdb.univ-lyon1.fr/networks)**: A tool to build interaction networks, with a filtering feature to explore specific interaction networks.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Technologies Used](#technologies-used)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Contributing](#contributing)
6. [License](#license)

## Project Structure

```plaintext
MatrixDB/
│
├── public/               # Public assets
├── src/                  # Main source files
│   ├── components/       # React components
│   ├── commons/          # Common React components
│   ├── stateManagement/  # Redux store management
│   ├── assets/           # Utility functions
│   ├── App.tsx            # Main React component
│   └── index.tsx          # Entry point for the React app
├── package.json          # Project dependencies and scripts
└── README.md   
```          

## Technologies Used

- **React**: Frontend library for building the user interface.
- **Cytoscape.js**: For interactive graph and network visualizations.
- **D3.js**: For additional data visualizations.
- **Node.js & NPM**: For managing dependencies and running the development server.

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Matrixdb-API](https://github.com/glyco-expasy/matrixdb-api) REST API access for

### Steps

1. Clone the repository:

   ```git clone https://github.com/yourusername/MatrixDB.git```
   cd MatrixDB

2. Install dependencies:

    ```npm install```

3. Run the development server:

    ```npm start```
    This will start the app on http://localhost:3000.


## Usage

- Access the home page at `http://localhost:3000`.
- Use the **Basic Search** for a Solr-based free text search.
- Use the **Advanced Search** to search with specific keywords, filtering ECM components and interactions.
- Click on nodes in the visualizations to explore connections and associated data.
- Navigate through different visualizations using the top menu.

### Example Queries

- Basic search for "collagen" to find all related biomolecules.
- Advanced search with keyword filters like [gene:LOX](https://matrixdb.univ-lyon1.fr/search?query=gene:LOX&mode=1) and [name:Fibronectin](https://matrixdb.univ-lyon1.fr/search?query=name:fibronectin&mode=1).

Please follow the project's coding standards and ensure that all contributions are well-documented and tested.

## License

This project is licensed under the GNU GPL v3.0 License. See the [LICENSE](https://choosealicense.com/licenses/gpl-3.0/) file for details.

