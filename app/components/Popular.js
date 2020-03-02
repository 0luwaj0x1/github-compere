import React from "react";
import propTypes from "prop-types";
import { fetchPopularRepos } from "../utils/api";
import {
  FaUser,
  FaStar,
  FaCodeBranch,
  FaExclamationTriangle
} from "react-icons/fa";
import Card from "./Card";
import Loading from "./Loading";
import Tooltip from "./Tooltip";

function LanguageNav({ selected, onUpdateLanguage }) {
  const languages = ["All", "Javascript", "Ruby", "Java", "CSS", "Phython"];

  return (
    <ul className="flex-center">
      {languages.map(language => (
        <li key={language}>
          <button
            style={language === selected ? { color: "rgb(187,46,31)" } : null}
            onClick={() => onUpdateLanguage(language)}
            className="btn-clear nav-link"
          >
            {language}
          </button>
        </li>
      ))}
    </ul>
  );
}

LanguageNav.propTypes = {
  selected: propTypes.string.isRequired,
  onUpdateLanguage: propTypes.func.isRequired
};

const ReposGrid = ({ repos }) => {
  return (
    <ul className="grid space-around">
      {repos.map((repo, index) => {
        const {
          name,
          owner,
          html_url,
          stargazers_count,
          forks,
          open_issues
        } = repo;
        const { login, avatar_url } = owner;

        return (
          <li key={html_url} className="repo bg-light">
            <Card
              header={`#${index + 1}`}
              avatar={avatar_url}
              href={html_url}
              name={login}
            >
              <ul className="card-list">
                <li>
                  <Tooltip text="Github usernsme">
                    <FaUser color="rgb(255, 191, 116)" size={22} />
                    <a href={`https://github.com/${login}`}>{login}</a>
                  </Tooltip>
                </li>
                <li>
                  <FaStar color="rgb(255, 215, 0)" size={22} />
                  {stargazers_count.toLocaleString()} stars
                </li>
                <li>
                  <FaCodeBranch color="rgb(255, 195, 245)" size={22} />
                  {forks.toLocaleString()} forks
                </li>
                <li>
                  <FaExclamationTriangle color="rgb(241, 138, 147)" size={22} />
                  {open_issues.toLocaleString()} issues
                </li>
              </ul>
            </Card>
          </li>
        );
      })}
    </ul>
  );
};

ReposGrid.propTypes = {
  repos: propTypes.array.isRequired
};

export default class Popular extends React.Component {
  state = {
    selectedLanguage: "All",
    repos: {},
    error: null
  };

  componentDidMount() {
    this.updatedLanguage(this.state.selectedLanguage);
  }

  updatedLanguage = (selectedLanguage) => {
    this.setState({
      selectedLanguage,
      error: null
    });

    if (!this.state.repos[selectedLanguage]) {
      fetchPopularRepos(selectedLanguage)
        .then(data => {
          this.setState(({ repos }) => ({
            repos: {
              ...repos,
              [selectedLanguage]: data
            }
          }));
        })
        .catch(error => {
          console.warn("Error fetching repos", error);
          this.setState({
            error: `There was an error fetching the repositories.`
          });
        });
    }
  }

  isLoading = () => {
    const { selectedLanguage, repos, error } = this.state;

    return !repos[selectedLanguage] && this.state.error === null;
  }

  render() {
    const { selectedLanguage, error, repos } = this.state;

    return (
      <React.Fragment>
        <LanguageNav
          selected={selectedLanguage}
          onUpdateLanguage={this.updatedLanguage}
        />
        {this.isLoading() && <Loading text="Fetching Repos" />}
        {error && <p className="center-text error">{error}</p>}
        {repos[selectedLanguage] && (
          <ReposGrid repos={repos[selectedLanguage]} />
        )}
      </React.Fragment>
    );
  }
}
