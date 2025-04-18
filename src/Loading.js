import React from "react";

function Loading(){
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#fff",
    },
    spinner: {
      width: "50px",
      height: "50px",
      border: "5px solid #ddd",
      borderTop: "5px solid #007bff", 
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    text: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#333",
      marginTop: "15px",
    },
    keyframes: `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `,
  };

  return (
    <div style={styles.container}>
      <style>{styles.keyframes}</style>
      <div style={styles.spinner}></div>
      <h2 style={styles.text}>Loading, please wait...</h2>
    </div>
  );
}

export default Loading;
