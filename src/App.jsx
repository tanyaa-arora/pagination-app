import { useState } from "react";
import { useEffect } from "react";
import "./App.css";
import searchImg from './assets/search.png'

function App() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [query, setQuery] = useState("");
  //derived states
  const selectedRows = filteredData.filter((row) => row.isSelected === true);
  let totalPages = 0;
  if (filteredData.length % 10 > 0) {
    totalPages = Math.ceil(filteredData.length / 10);
  } else {
    totalPages = filteredData.length / 10;
    if (totalPages === 0) {
      totalPages++;
    }
  }
  const buttons = [];
  for (let i = 1; i <= totalPages; i++) {
    buttons.push(
      <button key={i} onClick={() => handlePageChange(i)}>
        <h4>{i}</h4>
      </button>
    );
  }
  const startingRow = (currentPage - 1) * 10 + 1;
  let endingRow = startingRow + 9;
  let visibleRows = filteredData.filter(
    (row, index) => index + 1 >= startingRow && index + 1 <= endingRow
  );

  useEffect(() => {
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((response) => response.json())
      .then((data) =>
        setData(
          data.map((row) => ({
            ...row,
            isSelected: false,
            isEditable: false,
            isDeleted: false,
          }))
        )
      )
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  function deleteRow(id) {
    const newData = filteredData.filter((row) => row.id != id);
    setFilteredData(newData);
  }

  function deleteRows() {
    const newData = filteredData.filter((row) => row.isSelected === false);
    setFilteredData(newData);
  }

  function selectRow(id) {
    const newData = filteredData.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          isSelected: !row.isSelected,
        };
      } else {
        return row;
      }
    });
    setFilteredData(newData);
    console.log(filteredData);
  }

  function selectAll() {
    const newData = filteredData.map((row, index) => {
      if (index + 1 >= startingRow && index + 1 <= endingRow) {
        return {
          ...row,
          isSelected: !row.isSelected,
        };
      } else {
        return row;
      }
    });
    setFilteredData(newData);
  }

  function editRow(id) {
    const newData = filteredData.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          isEditable: !row.isEditable,
        };
      } else {
        return row;
      }
    });
    setFilteredData(newData);
  }
  function handleChange(e, id, key) {
    const newData = filteredData.map((row) => {
      if (row.name === key && row.id === id) {
        return {
          ...row,
          name: e.target.value,
        };
      } else if (row.email === key && row.id === id) {
        return {
          ...row,
          email: e.target.value,
        };
      } else if (row.role === key && row.id === id) {
        return {
          ...row,
          role: e.target.value,
        };
      } else {
        return row;
      }
    });
    setFilteredData(newData);
  }

  function saveRow(id) {
    const newData = filteredData.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          isEditable: !row.isEditable,
        };
      } else {
        return row;
      }
    });
    setFilteredData(newData);
  }

  function handleKeyChange(e) {
    if (e.keyCode === 13) {
      search();
    }
  }

  function search() {
    const newData =
      query.length > 0
        ? filteredData.filter(
            (row) =>
              row.name.toLowerCase().includes(query.toLowerCase()) ||
              row.email.toLowerCase().includes(query.toLowerCase()) ||
              row.role.toLowerCase().includes(query.toLowerCase())
          )
        : filteredData;
    setFilteredData(newData);
    setCurrentPage(1);
  }

  function handlePageChange(id) {
    setCurrentPage(id);
  }
  return (
    <div className="container">
      <div className="top-box">
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyChange}
          ></input>
          <button type="submit" onClick={search}>
            <img src={searchImg}/>
          </button>
        </div>
        <div>
          <button
            className="button-properties"
            type="button"
            onClick={deleteRows}
            disabled={selectedRows.length === 0 ? true : false}
          >
            <h4>DELETE SELECTED</h4>
          </button>
        </div>
      </div>
      <div className="row-information-box">
        <div className="row-box row-border">
          <div>
            <input
              type="checkbox"
              onChange={selectAll}
              checked={
                visibleRows.length > 0 &&
                visibleRows.every((row) => row.isSelected === true)
              }
            ></input>
          </div>
          <div>
            <h2>Name</h2>
          </div>
          <div>
            <h2>Email</h2>
          </div>
          <div>
            <h2>Role</h2>
          </div>
          <div>
            <h2>Action</h2>
          </div>
        </div>
        {visibleRows.length > 0 ? (
          visibleRows.map((row) => (
            <div
              className={
                row.isSelected
                  ? "row-box row-border checked-row"
                  : "row-box row-border"
              }
              key={row.id}
            >
              <div>
                <input
                  type="checkbox"
                  onChange={() => selectRow(row.id)}
                  checked={row.isSelected}
                ></input>
              </div>
              <div>
                {row.isEditable ? (
                  <input
                    placeholder="Enter Name"
                    value={row.name}
                    className="input-box"
                    onChange={(e) => handleChange(e, row.id, row.name)}
                  />
                ) : (
                  <p>{row.name}</p>
                )}
              </div>
              <div>
                {row.isEditable ? (
                  <input
                    placeholder="Enter email"
                    value={row.email}
                    className="input-box"
                    onChange={(e) => handleChange(e, row.id, row.email)}
                  />
                ) : (
                  <p>{row.email}</p>
                )}
              </div>
              <div>
                {row.isEditable ? (
                  <input
                    placeholder="Enter role"
                    value={row.role}
                    className="input-box"
                    onChange={(e) => handleChange(e, row.id, row.role)}
                  />
                ) : (
                  <p>{row.role}</p>
                )}
              </div>
              <div className="action-box">
                {row.isEditable ? (
                  <button
                    type="button"
                    className="save-button button-properties"
                    onClick={() => saveRow(row.id)}
                  >
                    <h4>SAVE</h4>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="edit-button button-properties"
                    onClick={() => editRow(row.id)}
                  >
                    <h4>EDIT</h4>
                  </button>
                )}
                <button
                  type="button"
                  className="delete-button button-properties"
                  onClick={() => deleteRow(row.id)}
                >
                  <h4>DELETE</h4>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>No rows to display</div>
        )}
      </div>
      <div className="footer">
        <div>
          <h4>
            {selectedRows.length} out of {filteredData.length} row(s) selected
          </h4>
        </div>
        <div className="page-component">
          <h4>
            {currentPage} out of {totalPages} pages
          </h4>
          <button
            type="button"
            className="first-page"
            onClick={() => handlePageChange(1)}
          >
            <h4>FIRST</h4>
          </button>
          <button
            type="button"
            className="prev-page"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <h4>PREV</h4>
          </button>
          {buttons}
          <button
            type="button"
            className="next-page"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <h4>NEXT</h4>
          </button>
          <button
            type="button"
            className="last-page"
            onClick={() => handlePageChange(totalPages)}
          >
            <h4>LAST</h4>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
