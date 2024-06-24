import React, { useState, useEffect } from "react";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
    fontFamily: "Arial, sans-serif",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.1)",
    width: "300px",
    justifyContent: "space-between",
  },
  checkboxLabel: {
    marginLeft: "10px",
    fontWeight: "bold",
    color: "#333",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  button: {
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    fontSize: "16px",
    marginTop: "20px",
    cursor: "pointer",
  },
};

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);

        // Fetch the data from data.txt
        const responseTxt = await fetch("/api/data");
        if (!responseTxt.ok) {
          throw new Error(`HTTP error! status: ${responseTxt.status}`);
        }
        const dataTxt = await responseTxt.text();

        // Extract the project names from the concurrently command
        const concurrentlyCommand = dataTxt.split("\n")[0];
        const namesMatch = concurrentlyCommand.match(/--names "(.*?)"/);
        if (namesMatch?.length > 1) {
          const selectedProjectNames = namesMatch[1].split(",");
          const selectedProjects = {};
          for (const name of selectedProjectNames) {
            selectedProjects[name] = true;
          }
          setSelectedProjects(selectedProjects);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchProjects();
  }, []);

  const handleCheckboxChange = (name) => {
    setSelectedProjects({
      ...selectedProjects,
      [name]: !selectedProjects[name],
    });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleSave = async () => {
    const selectedProjectNames = Object.keys(selectedProjects).filter(
      (name) => selectedProjects[name]
    );

    const response = await fetch("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedProjectNames),
    });

    if (response.ok) {
      alert("Saved successfully");
    } else {
      alert("Failed to save");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Select components to start</h1>
      {projects
        .filter((project) => project.name !== "host")
        .map((project) => (
          <div
            key={project.name}
            style={styles.checkboxContainer}
            onClick={() => handleCheckboxChange(project.name)}
          >
            <input
              type="checkbox"
              name={project.name}
              checked={selectedProjects[project.name] || false}
              onChange={() => {}}
            />
            <label style={styles.checkboxLabel}>{project.name}</label>
          </div>
        ))}
      <button style={styles.button} onClick={handleSave}>
        Save
      </button>
    </div>
  );
}
