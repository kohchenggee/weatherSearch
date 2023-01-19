import search from "./assets/search.svg";
import deleteIcon from "./assets/delete.svg";
import './App.css';

export default function SearchHistory({searchHistory, weatherSearch, removeHistory}){
    if (!searchHistory) return null;
    return (
      <div>
        {searchHistory.map((item, index) => (
          <div className="searchItem" key={`SearchItem_${index}`}>
            <div>
              {index + 1}. {item.name}, {item.country}
            </div>
            <div className="searchItemRightSection">
              <div>{item?.time}</div>
              <img
                src={search}
                className="imageButton"
                onClick={() => weatherSearch(item.locationString)}
                alt="searchButton"
              />
              <img
                src={deleteIcon}
                className="imageButton"
                onClick={() => removeHistory(index)}
                alt="deleteButton"
              />
            </div>
          </div>
        ))}
      </div>
    );
  };