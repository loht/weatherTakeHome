import React, { Component } from "react";
import EditableSection from "./EditableSection";
import WeatherCard from "./WeatherCard";
import TextMessage from "./TextMessage";
import "./styles/App.css";
import "./styles/Spacer.css";

const ERROR_MESSAGE = 'An error has occured reading the data. Please contact your administrator for details.';
const NO_DATA = 'No Data';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      location: '',
      startDate: null,
      endDate: null,
      showError: false,
    };
  }

  componentDidMount() {
    fetch('test-data.json')
      .then((r) => r.json())
      .then(
        (data) => {
          const cleanedData = data.map((item) => {
            return {
              date: item.date,
              weather: item.weather,
              // Assumed both location and town attributes were valid for locations.
              // Location taking the priority due to what was displayed in the sample outputs
              // Assumed the instructions sample output is the more 'correct' data contract.
              location: item.location ? item.location : item.town, 
            };
          });
          this.setState({
            data: cleanedData,
            filteredData: cleanedData,
          });
        }
      )
      .catch((e) => {
        console.error(ERROR_MESSAGE, e);
        this.setState({
          showError: true,
        })
      });
  }

  onLocationChange = (event) => {
      if (event.target.value !== this.state.location) {
        this.setState({
          location: event.target.value, 
        });
      }
  }

  onStartDateChange = (startDate) => {
    if (startDate !== this.state.startDate) {
      this.setState({
        startDate: startDate,
      });
    }
  }

  onEndDateChange = (endDate) => {
    if (endDate !== this.state.endDate) {
      this.setState({
        endDate: endDate,
      });
    }
  };

  render() {
    const filteredData =
      this.state?.data
        .filter(
          (item) => {
            if (this.state.location !== '') {
              return item.location.toLocaleLowerCase().includes(this.state.location.toLocaleLowerCase());
            } else {
              return true;
            }
          },
        )
        .filter(
          (item) => {
            if (this.state.startDate !== null) {
              const startDate = new Date(this.state.startDate);
              const itemDate = new Date(item.date);
              //Assumed edge filters are inclusive.
              return startDate <= itemDate;
            } else {
              return true;
            }
          },
        )
        .filter(
          (item) => {
            if (this.state.endDate !== null) {
              const endDate = new Date(this.state.endDate);
              const itemDate = new Date(item.date);
              //Assumed edge filters are inclusive.
              return endDate >= itemDate;
            } else {
              return true;
            }
          },
        ) ?? [];

    return (
      <div className="App">
        <EditableSection
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          location={this.state.location}
          onStartDateChange={this.onStartDateChange}
          onEndDateChange={this.onEndDateChange}
          onLocationChange={this.onLocationChange}
        />
        <div className="editable-section display-section">
          {
            !this.state.showError && filteredData.map((item, index) => (
              <WeatherCard
                key={item.date + item.weather + item.location}
                date={item.date}
                weather={item.weather}
                location={item.location}
                // Right side padding fix
                isLast={index + 1 === filteredData.length}
              />
            ))
          }
          {
            filteredData.length > 0 && (
              //Right side padding fix.
              <div className="spacer" />
            )
          }
          {
            !this.state.showError && filteredData.length === 0 && (
              <TextMessage message={NO_DATA} />
            )
          }
          {
            this.state.showError && (
              <TextMessage message={ERROR_MESSAGE} />
            )
          }
        </div>
      </div>
    );
  }
}

export default App;
