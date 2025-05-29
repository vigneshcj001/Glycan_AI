import React, { useState, useEffect, useCallback, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// Simple debounce function
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

const PathwayViewer = () => {
  const [pathwayIdInput, setPathwayIdInput] = useState("");
  const [pathwayToLoad, setPathwayToLoad] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [actualKeggIdUsed, setActualKeggIdUsed] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [searchTermForApi, setSearchTermForApi] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const searchInputRef = useRef(null);
  const transformWrapperRef = useRef(null);

  const examplePathways = [
    { id: "map00010", name: "Glycolysis / Gluconeogenesis (map)" },
    { id: "hsa00010", name: "Glycolysis (Homo sapiens)" },
    { id: "ko00010", name: "Glycolysis (KEGG Orthology)" },
    { id: "eco00260", name: "Glycine, serine, threonine metabolism (E. coli)" },
    { id: "map01100", name: "Metabolic pathways (Reference)" },
  ];

  const fetchPathwayData = async (idToFetch) => {
    if (!idToFetch) {
      setError("Please enter or select a KEGG Pathway ID to load.");
      return;
    }
    setIsLoading(true);
    setImageUrl("");
    setError("");
    setWarning("");
    setActualKeggIdUsed("");

    try {
      const queryParams = new URLSearchParams({ kegg_id: idToFetch });
      const res = await fetch(
        `http://localhost:5000/pathway?${queryParams.toString()}`
      );
      const data = await res.json();

      if (res.ok) {
        setImageUrl(data.img_url);
        setActualKeggIdUsed(data.kegg_id_used || idToFetch);
        if (data.warning) setWarning(data.warning);
      } else {
        setError(data.error || "Failed to load pathway. Unknown error.");
        console.error("Error from backend (/pathway):", data.error, data);
      }
    } catch (err) {
      setError("Failed to connect to the server or parse response.");
      console.error("Failed to load pathway (fetch error):", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadPathway = () => {
    if (!pathwayToLoad.trim()) {
      setError(
        "No valid KEGG Pathway ID is set for loading. Please enter an ID or select from search."
      );
      return;
    }
    fetchPathwayData(pathwayToLoad);
  };

  const handleExampleClick = (exampleId, exampleName) => {
    setPathwayIdInput(`${exampleName} (${exampleId})`);
    setPathwayToLoad(exampleId);
    setSearchTermForApi("");
    setSearchResults([]);
    setShowSearchDropdown(false);
    setError("");
    setWarning("");
  };

  const debouncedSearchApi = useCallback(
    debounce(async (currentSearchTerm) => {
      if (currentSearchTerm.length < 3) {
        setSearchResults([]);
        setShowSearchDropdown(false);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(
          `http://localhost:5000/search_pathways?query=${encodeURIComponent(
            currentSearchTerm
          )}`
        );
        const data = await res.json();
        if (res.ok) {
          setSearchResults(data);
          setShowSearchDropdown(data.length > 0);
        } else {
          console.warn("Search API error:", data.error);
          setSearchResults([]);
          setShowSearchDropdown(false);
        }
      } catch (err) {
        console.warn("Search connection error:", err);
        setSearchResults([]);
        setShowSearchDropdown(false);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (searchTermForApi.trim() !== "") {
      debouncedSearchApi(searchTermForApi);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  }, [searchTermForApi, debouncedSearchApi]);

  const handlePathwayIdInputChange = (e) => {
    const value = e.target.value;
    setPathwayIdInput(value);
    setSearchTermForApi(value);

    if (value.match(/^[a-zA-Z]{2,4}\d{5}$|^map\d{5}$|^\d{5}$/i)) {
      setPathwayToLoad(value.trim());
    } else {
      if (
        pathwayToLoad &&
        !value.toLowerCase().includes(pathwayToLoad.toLowerCase())
      ) {
        setPathwayToLoad("");
      } else if (!pathwayToLoad && value.trim() === "") {
        setPathwayToLoad("");
      }
    }
  };

  const handleSearchDropdownItemClick = (path) => {
    setPathwayIdInput(`${path.name} (${path.id})`);
    setPathwayToLoad(path.id);
    setSearchTermForApi(path.id);
    setShowSearchDropdown(false);
    setSearchResults([]);
    setError("");
    setWarning("");
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDownloadImage = async () => {
    if (!imageUrl) {
      alert("No image loaded to download.");
      return;
    }
    try {
      // Fetch the image as a blob.
      // IMPORTANT: If the image is from a different origin (KEGG) and CORS is not set up
      // on the KEGG server to allow your frontend's origin for GET requests,
      // this fetch will fail due to CORS policy.
      // The Flask backend acts as a proxy, so the image URL *should* be from localhost.
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch image for download: ${response.statusText}`
        );
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      // Suggest a filename (e.g., map00010.png)
      const filename = actualKeggIdUsed
        ? `${actualKeggIdUsed}.png`
        : "kegg_pathway.png";
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl); // Clean up
    } catch (error) {
      console.error("Error downloading image:", error);
      setError(
        `Failed to download image. ${error.message}. This might be a CORS issue if the image URL is directly from KEGG and not proxied.`
      );
      // Fallback: Open in new tab for manual save
      // window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto font-sans antialiased text-gray-800">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700">
          KEGG Pathway Viewer
        </h1>
        <p className="text-md text-gray-600 mt-1">Explore KEGG pathways.</p>
      </header>

      <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
        {/* Input Section */}
        <div className="mb-4">
          {" "}
          {/* Added mb-4 here for overall spacing below input section */}
          <div className="relative pb-6" ref={searchInputRef}>
            {" "}
            {/* Added pb-6 for padding-bottom to make space for "Searching..." */}
            <label
              htmlFor="pathwaySearchInput"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Pathway Name or Enter ID:
            </label>
            <input
              id="pathwaySearchInput"
              type="text"
              value={pathwayIdInput}
              onChange={handlePathwayIdInputChange}
              onFocus={() =>
                pathwayIdInput &&
                searchResults.length > 0 &&
                setShowSearchDropdown(true)
              }
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 'glycolysis' or 'map00010'"
              autoComplete="off"
            />
            {isSearching && (
              <p className="text-xs text-gray-500 mt-1 absolute bottom-0 left-0">
                Searching...
              </p>
            )}{" "}
            {/* Positioned at bottom */}
            {showSearchDropdown && searchResults.length > 0 && (
              <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                {searchResults.map((path) => (
                  <li
                    key={path.id}
                    onClick={() => handleSearchDropdownItemClick(path)}
                    className="p-3 hover:bg-blue-100 cursor-pointer text-sm"
                  >
                    {path.name}{" "}
                    <span className="text-gray-500">({path.id})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          onClick={handleLoadPathway}
          disabled={isLoading || !pathwayToLoad.trim()}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 text-lg font-semibold"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...
            </div>
          ) : (
            "Load Pathway"
          )}
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Example Pathways:
        </h3>
        <div className="flex flex-wrap gap-2">
          {examplePathways.map((ex) => (
            <button
              key={ex.id}
              onClick={() => handleExampleClick(ex.id, ex.name)}
              title={`Load ${ex.name} (${ex.id})`}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-opacity-50
                          ${
                            pathwayToLoad === ex.id
                              ? "bg-green-600 text-white focus:ring-green-400"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400"
                          }`}
            >
              {ex.name.length > 40 ? ex.id : ex.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-red-700 bg-red-100 border border-red-500 p-3 rounded-md text-center mb-4 shadow animate-shake">
          {error}
        </p>
      )}
      {warning && !error && (
        <p className="text-yellow-800 bg-yellow-100 border border-yellow-500 p-3 rounded-md text-center mb-4 shadow">
          {warning}
        </p>
      )}

      {isLoading && !imageUrl && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}

      {imageUrl && !isLoading ? (
        <div className="border border-gray-300 p-1 rounded-lg shadow-xl overflow-hidden bg-gray-50">
          <TransformWrapper
            key={imageUrl}
            ref={transformWrapperRef}
            initialScale={1}
            minScale={0.1}
            maxScale={10}
            centerOnInit={true}
            limitToBounds={false}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className="text-sm text-gray-700 p-3 bg-gray-100 border-b border-gray-300 flex justify-between items-center flex-wrap gap-2">
                  <span>
                    Displaying pathway:{" "}
                    <strong className="text-black">{actualKeggIdUsed}</strong>
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => zoomIn(0.2)}
                      title="Zoom In"
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      +
                    </button>
                    <button
                      onClick={() => zoomOut(0.2)}
                      title="Zoom Out"
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      -
                    </button>
                    <button
                      onClick={() => resetTransform()}
                      title="Reset Zoom"
                      className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleDownloadImage}
                      title="Download Image"
                      disabled={!imageUrl}
                      className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
                    >
                      Download
                    </button>
                  </div>
                </div>
                <TransformComponent
                  wrapperStyle={{
                    width: "100%",
                    maxHeight: "calc(100vh - 300px)",
                    minHeight: "400px",
                    cursor: "grab",
                    backgroundColor: "#fff",
                  }}
                  contentStyle={{ width: "100%", height: "100%" }}
                >
                  <img
                    src={imageUrl}
                    alt={`KEGG Pathway ${actualKeggIdUsed}`}
                    className="max-w-none w-auto h-auto mx-auto block"
                    onError={() =>
                      setError(
                        `Failed to load image from URL for ${actualKeggIdUsed}. The URL might be invalid or the image doesn't exist at KEGG.`
                      )
                    }
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
      ) : (
        !error &&
        !isLoading &&
        !warning && (
          <p className="text-gray-500 text-center py-10 text-lg">
            No pathway loaded. Enter an ID or search, then click "Load Pathway".
          </p>
        )
      )}
      <footer className="text-center mt-12 py-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Pathway data and images from{" "}
          <a
            href="https://www.kegg.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            KEGG: Kyoto Encyclopedia of Genes and Genomes
          </a>
          .
        </p>
      </footer>
    </div>
  );
};

export default PathwayViewer;
