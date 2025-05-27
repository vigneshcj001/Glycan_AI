import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";

const ResultsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const ids = [
    "1535-3907",
    "1618-2650",
    "1879-0534",
    "1422-0067",
    "1618-0623",
    "1548-7105",
    "1756-8722",
    "1460-2423",
    "2155-384X",
    "1364-5528",
    "1437-4331",
    "1662-5129",
    "1098-2787",
    "1520-6890",
    "1873-1899",
    "1554-8937",
    "1879-0003",
  ];

  const id_types_param = ids.map((id) => `${id}@electronic`).join(",");

  useEffect(() => {
    if (!query) return;

    setLoading(true);

    axios
      .get(`https://www.pubmed.ai/api/v1/retrieval/xiantao/magazine`, {
        params: {
          id_types: id_types_param,
          "fields[]": ["jif", "jcr_quartile"],
        },
      })
      .then((res) => {
        const data = res.data;
        // It's probably an object — if it's an array, you can use it directly
        const resultArray = Array.isArray(data)
          ? data
          : data.results || Object.values(data) || [];
        setResults(resultArray);
      })
      .catch((err) => {
        console.error("API error:", err);
        setResults([]);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Results for "{query}"</h2>

      {loading ? (
        <p>Loading...</p>
      ) : Array.isArray(results) && results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item, index) => (
            <div key={index} className="p-4 border rounded shadow bg-white">
              <h3 className="font-bold text-lg">
                {item.journal_name || "Unnamed Journal"}
              </h3>
              <p>
                <strong>JIF:</strong> {item.jif ?? "N/A"}
              </p>
              <p>
                <strong>Quartile:</strong> {item.jcr_quartile ?? "N/A"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default ResultsPage;
