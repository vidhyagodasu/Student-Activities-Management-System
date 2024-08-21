import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import * as XLSX from 'xlsx';

function Project1() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    department: {
      IT: true,
      CSE: false,
    },
    academicYear: {
      All: true,
      "2019-2020" : false,
      "2020-2021" : false,
      "2021-2022" : false,
      "2022-2023" : false,
      "2023-2024" : false,
    },
    activityNature:{
      All:true,
      "Wipro Certified Faculty [WCF] Training":false,
      "Add-on course":false,
      "Internship":false,
      "On-Job training":false,
      "Associate Developer Educator Training":false,
      "Industrial training":false,
      "Educator Training":false,
      "Research Sabbatical":false,
      "Workshop":false,
      "Interaction Session":false,
    },
    collaborativeActivity:{
      All:true,
      "Wipro Certified Faculty [WCF] Training":false,
      "CCNAv7: Introduction to Networks":false,
      "CCNAv7: Switching, Routing, and Wireless Essentials":false,
      "CCNAv7: Enterprise Networking, Security, and Automation":false,
      "Salesforce Developer Virtual Internship":false,
      "Wipro Talent next":false,
      "Student Internship":false,
      "AWS Cloud Virtual Internship":false,
    },
    collaboratingAgency:{
      All:true,
      "Wipro - TalentNext 2023":false,
      CISCO:false,
      "AICTE, Salesforce, SmartBridge, SamrtInternz":false,
      "Smart Interz":false,
      "Wipro Talent Next":false,
      "AICTE-EduSkills":false,
      SmartBridge:false,
      AICTE:false,
    }
  });

  useEffect(() => {
    axios.get('http://localhost:3001/getUsers')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const applyFilters = () => {
    const filteredUsers = users.filter((user) => {
      const departmentFilter = filters.department.IT && user.Department === 'IT' || filters.department.CSE && user.Department === 'CSE';
      const academicYearFilter = filters.academicYear.All || filters.academicYear[user.Academic_Year];
      const collaborativeActivityFilter= filters.collaborativeActivity.All || filters.collaborativeActivity[user.Title_of_the_collaborative_activity];
      const collaboratingAgencyFilter=filters.collaboratingAgency.All || filters.collaboratingAgency[user.Name_of_the_collaborating_agency_with_contact_details];
      const activityNatureFilter=filters.activityNature.All || filters.activityNature[user.Nature_of_the_activity];
      return departmentFilter && academicYearFilter && collaborativeActivityFilter && collaboratingAgencyFilter && activityNatureFilter;
    });

    return filteredUsers;
  };

  const handleCheckboxChange = (category, value) => {
    setFilters({
      ...filters,
      [category]: {
        ...filters[category],
        [value]: !filters[category][value],
      },
    });
  };

  const filteredUsers = applyFilters();
  const downloadExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'students.xlsx');
  };

  const sortedFilteredUsers = filteredUsers.sort((a, b) => a.Sno - b.Sno);

  const addSerialNumbers = (data) => {
    return data.map((item, index) => ({
      ...item,
      Sno: index + 1,
    }));
  };

  // Add serial numbers to the sortedFilteredUsers
  const dataWithSerialNumbers = addSerialNumbers(sortedFilteredUsers);

  return (
      
    <div className="d-flex">
      <div className="sidebar">
        <h4>Department</h4>
        <div className="checkbox-group">
        {Object.keys(filters.department).map((value) => (
          <label key={value} className="checkbox-label" >
            <input
              id={`form-checkbox-${value}`}
              name="checkbox"
              type="checkbox"
              checked={filters.department[value]}
              onChange={() => handleCheckboxChange('department', value)}
            />
            <span className="checkmark"></span>
            {value}
            </label>
        ))}
      </div>

        <h4>Collaborative Activity</h4>
        <div className="checkbox-group">
          {Object.keys(filters.collaborativeActivity).map((value) => (
            <label key={value} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.collaborativeActivity[value]}
                onChange={() => handleCheckboxChange('collaborativeActivity', value)}
              />
            <span className="checkmark"></span>
              {value}
            </label>
          ))}
        </div>

        <h4>Academic Year</h4>
        <div className="checkbox-group">
          {Object.keys(filters.academicYear).map((value) => (
            <label key={value} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.academicYear[value]}
                onChange={() => handleCheckboxChange('academicYear', value)}
              />
            <span className="checkmark"></span>
              {value}
            </label>
          ))}
        </div>

        <h4>Collaborating Agency</h4>
        <div className="checkbox-group">
          {Object.keys(filters.collaboratingAgency).map((value) => (
            <label key={value} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.collaboratingAgency[value]}
                onChange={() => handleCheckboxChange('collaboratingAgency', value)}
              />
              <span className="checkmark"></span>
              {value}
            </label>
          ))}
        </div>

        <h4>Nature of the Activity</h4>
        <div className="checkbox-group">
          {Object.keys(filters.activityNature).map((value) => (
            <label key={value} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.activityNature[value]}
                onChange={() => handleCheckboxChange('activityNature', value)}
              />
              <span className="checkmark"></span>
              {value}
            </label>
          ))}
        </div>
      </div>

      

      <div className="content">
        <table className="table">
          <thead>
          <tr>
            <th>
            S.No
            </th>
            <th>
            Title of the Collaborative Activity
            </th>
            <th>
            Name of the Collaborating Agency 
            </th>
            <th>
            Name of the participant
            </th>
            <th>
            Year of Collaboration
            </th>
            <th>
            Duration
            </th>
            <th>
            Nature of the Activity
            </th>
            
          </tr>
          </thead>

          <tbody>
            {dataWithSerialNumbers.map((user) => (
              <tr key={user.Sno}>
                <td>{user.Sno}</td>
                <td>{user.Title_of_the_collaborative_activity}</td>
                <td>{user.Name_of_the_collaborating_agency_with_contact_details}</td>
                <td>{user.Name_of_the_participant}</td>
                <td>{user.Year_of_Collaboration}</td>
                <td>{user.Duration}</td>
                <td>{user.Nature_of_the_activity}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="download-button">
        <button className="btn btn-primary" onClick={downloadExcel}>
          Download Excel
        </button>
      </div>
    </div>
  );
}
  

function Project2() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    department1: {
      IT: true,
      CSE: false,
    },
    academicYear1: {
      All: true,
      "2019-2020" : false,
      "2020-2021" : false,
      "2021-2022" : false,
      "2022-2023" : false,
      "2023-2024" : false,
    },
    awardName:{
      All:true,
      "Flutter workshop(stepcone)":false,
      "SPL-Cricket(District Winner)":false,
      "Workshop on Dart programming language":false,
      "ANGULAR JS TO DEVELOP WEB APPS FASTER":false,
      "Cross Country (Youth Fest)":false,
      "12th Edition Eenadu Champion Cricket Cup 2018":false,
      "The Snaps Club Online Photography League":false,
      "NSS Special Camp Programme":false,
    },
    yearOfAward:{
      All:true,
      "2022-2023":false,
      "2021-2022":false,
      "2020-2021":false,
      "2019-2020":false,
      "2018-2019":false,
    },
  });

  useEffect(() => {
    axios.get('http://localhost:3001/getUsers')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const applyFilters = () => {
    const filteredUsers = users.filter((user) => {
      const departmentFilter = filters.department1.IT && user.Department_1 === 'IT' || filters.department1.CSE && user.Department_1 === 'CSE';
      const academicYearFilter = filters.academicYear1.All || filters.academicYear1[user.Academic_Year1];
      const awardNameFilter= filters.awardName.All || filters.awardName[user.Award];
      const yearOfAwardFilter=filters.yearOfAward.All || filters.yearOfAward[user.Year_of_Award];
      return departmentFilter && academicYearFilter && awardNameFilter && yearOfAwardFilter ;
    });

    return filteredUsers;
  };
  const handleCheckboxChange = (category, value) => {
    setFilters({
      ...filters,
      [category]: {
        ...filters[category],
        [value]: !filters[category][value],
      },
    });
  };

  const filteredUsers = applyFilters();


  const downloadExcel = () => {
  // Create a copy of the filtered and sorted data
  const sortedFilteredUsersCopy = [...dataWithSerialNumbers];

  // Generate serial numbers starting from 1
  const dataWithSerialNumbersInOrder = sortedFilteredUsersCopy.map((user, index) => ({
    ...user,
    Sno: index + 1,
  }));

  // Create Excel file
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(dataWithSerialNumbersInOrder);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
  XLSX.writeFile(workbook, 'students.xlsx');
};


  const sortedFilteredUsers = filteredUsers.sort((a, b) => a.Sno - b.Sno);

  const addSerialNumbers = (data) => {
    return data.map((item, index) => ({
      ...item,
      Sno: index + 1,
    }));
  };

  // Add serial numbers to the sortedFilteredUsers
  const dataWithSerialNumbers = addSerialNumbers(sortedFilteredUsers);

  return (
    <div className="d-flex">
      <div className="sidebar">
        <h4>Department</h4>
        <div className="checkbox-group">
        {Object.keys(filters.department1).map((value) => (
          <label key={value} className="checkbox-label" >
            <input
              id={`form-checkbox-${value}`}
              name="checkbox"
              type="checkbox"
              checked={filters.department1[value]}
              onChange={() => handleCheckboxChange('department1', value)}
            />
            <span className="checkmark"></span>
            {value}
            </label>
        ))}
      </div>

        <h4>Name of the Award</h4>
        <div className="checkbox-group">
          {Object.keys(filters.awardName).map((value) => (
            <label key={value} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.awardName[value]}
                onChange={() => handleCheckboxChange('awardName', value)}
              />
            <span className="checkmark"></span>
              {value}
            </label>
          ))}
        </div>

        <h4>Academic Year</h4>
        <div className="checkbox-group">
          {Object.keys(filters.academicYear1).map((value) => (
            <label key={value} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.academicYear1[value]}
                onChange={() => handleCheckboxChange('academicYear1', value)}
              />
            <span className="checkmark"></span>
              {value}
            </label>
          ))}
        </div>

        <h4>Year of Award</h4>
        <div className="checkbox-group">
          {Object.keys(filters.yearOfAward).map((value) => (
            <label key={value} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.yearOfAward[value]}
                onChange={() => handleCheckboxChange('yearOfAward', value)}
              />
              <span className="checkmark"></span>
              {value}
            </label>
          ))}
        </div>  
      </div>

      

      <div className="content">
        <table className="table">
          <thead>
          <tr>
            <th>
            S.No
            </th>
            <th>
            Name of the Student
            </th>
            <th>
            Name of the Award/ recognition 
            </th>
            <th>
            Name of the Awarding government/ government recognised bodies
            </th>
            <th>
            Year of award 
            </th>
          </tr>
          </thead>

          <tbody>
            {dataWithSerialNumbers
              .filter(user => Object.values(user).some(value => value !== '')) // Filter out rows with empty values
              .map((user) => (
                <tr key={user.Sno}>
                  <td>{user.Sno}</td>
                <td>{user.Student_Name}</td>
                <td>{user.Award}</td>
                <td>{user.Awarding_government}</td>
                <td>{user.Year_of_Award}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="download-button">
        <button className="btn btn-primary" onClick={downloadExcel}>
          Download Excel
        </button>
      </div>
    </div>
  );
}

function Project3(){
  const [users, setUsers] = useState([]);
  const [ca, setCa] = useState('');
  const [cg, setCg] = useState('');
  const [participant, setParticipant] = useState('');
  const [cy, setCy] = useState('');
  const [duration, setDuration] = useState('');
  const [na, setNa] = useState('');
  const [dept, setDept] = useState('');
  const [ay, setAy] = useState('');
  

  useEffect(() => {
    axios.get('http://localhost:3001/getUsers')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = () => {

    if (!ca || !cg || !participant || !cy || !duration || !na || !dept || !ay) {
      window.alert('Please fill in all required fields.');
      return;
    }
    const newUser = {
      Title_of_the_collaborative_activity: ca,
      Name_of_the_collaborating_agency_with_contact_details: cg,
      Name_of_the_participant : participant,
      Year_of_Collaboration : cy,
      Duration : duration,
      Nature_of_the_activity : na,
      Department : dept,
      Academic_Year : ay,
    };

    axios.post('http://localhost:3001/createUser', newUser)
      .then((response) => {
        console.log(response);
        // Update the state with the new user
        setUsers([...users, newUser]);
        // Reset input fields
        setCa('');
        setCg('');
        setParticipant('');
        setCy('');
        setDuration('');
        setNa('');
        setDept('');
        setAy('');
        window.alert('Data submitted successfully!');
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='project3-container'>
      <br />
      <div className="form-input">
        <label>Collaborative Activity</label>
        <select value={ca} onChange={(e) => setCa(e.target.value)} style={{ width: '402px' ,height:'45px'}} required>
        <option value=""></option>
          <option value="Wipro Certified Faculty [WCF] Training">Wipro Certified Faculty [WCF] Training</option>
          <option value="CCNAv7: Introduction to Networks">CCNAv7: Introduction to Networks</option>
          <option value="CCNAv7: Switching, Routing, and Wireless Essentials">CCNAv7: Switching, Routing, and Wireless Essentials</option>
          <option value="CCNAv7: Enterprise Networking, Security, and Automation">CCNAv7: Enterprise Networking, Security, and Automation</option>
          <option value="Salesforce Developer Virtual Internship">Salesforce Developer Virtual Internship</option>
          <option value="Wipro Talent next">Wipro Talent next</option>
          <option value="Student Internship">Student Internship</option>
          <option value="AWS Cloud Virtual Internship">AWS Cloud Virtual Internship</option>
        </select>
      </div>

      <div className="form-input">
        <label>Collaborating Agency Name</label>
        <select value={cg} onChange={(e) => setCg(e.target.value)} style={{ width: '402px' ,height:'45px'}} required>
          <option value=""></option>
          <option value="Wipro - TalentNext 2023">Wipro - TalentNext 2023</option>
          <option value="CISCO">CISCO</option>
          <option value="AICTE, Salesforce, SmartBridge, SamrtInternz">AICTE, Salesforce, SmartBridge, SamrtInternz</option>
          <option value="Smart Interz">Smart Interz</option>
          <option value="Wipro Talent Next">Wipro Talent Next</option>
          <option value="AICTE-EduSkills">AICTE-EduSkills</option>
          <option value="SmartBridge">SmartBridge</option>
          <option value="AICTE">AICTE</option>
        </select>
      </div>

      <div className="form-input">
        <label>Participant Name</label>
        <input type="text" value={participant} onChange={(e) =>  setParticipant(e.target.value)} required/>
      </div>

      <div className="form-input">
        <label>Collaboration Year</label>
        <select value={cy} onChange={(e) => setCy(e.target.value)} style={{ width: '402px',height:'45px' }} required>
        <option value=""></option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
        </select>
      </div>

      <div className="form-input">
        <label>Duration</label>
        <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} required/>
      </div>

      <div className="form-input">
        <label>Nature of the Activity</label>
        <select value={na} onChange={(e) => setNa(e.target.value)} style={{ width: '402px', height:'45px'}} required>
        <option value=""></option>
          <option value="Wipro Certified Faculty [WCF] Training">Wipro Certified Faculty [WCF] Training</option>
          <option value="Add-on course">Add-on course</option>
          <option value="Internship">Internship</option>
          <option value="On-Job training">On-Job training</option>
          <option value="Associate Developer Educator Training">Associate Developer Educator Training</option>
          <option value="Industrial training">Industrial training</option>
          <option value="Educator Training">Educator Training</option>
          <option value="Research Sabbatical">Research Sabbatical</option>
          <option value="Workshop">Workshop</option>
          <option value="Interaction Session">Interaction Session</option>
        </select>
      </div>

      <div className="form-input">
        <label>Department</label>
        <select value={dept} onChange={(e) => setDept(e.target.value)} style={{ width: '402px' ,height:'45px'}} required>
        <option value=""></option>
          <option value="IT">IT</option>
          <option value="CSE">CSE</option>
        </select>
      </div>

      <div className="form-input">
        <label>Academic Year</label>
        <select value={ay} onChange={(e) => setAy(e.target.value)} style={{ width: '402px' ,height:'45px'}} required>
        <option value=""></option>
          <option value="2019-2020">2019 - 2020</option>
          <option value="2020-2021">2020 - 2021</option>
          <option value="2021-2022">2021 - 2022</option>
          <option value="2022-2023">2022 - 2023</option>
          <option value="2023-2024">2023 - 2024</option>
        </select>
        <button onClick={handleSubmit}>Upload Data</button>
      </div>

    </div>
  )

}

function Project4(){
  const [users, setUsers] = useState([]);
  const [sname, setSname] = useState('');
  const [award, setAward] = useState('');
  const [ag, setAg] = useState('');
  const [yearOfAward, setYearOfAward] = useState('');
  const [dept1, setDept1] = useState('');
  const [ay1, setAy1] = useState('');
  

  useEffect(() => {
    axios.get('http://localhost:3001/getUsers')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = () => {

    if (!sname || !award || !ag || !yearOfAward || !dept1 || !ay1 ) {
    window.alert('Please fill in all required fields.');
    return;
  }
    const newUser = {
      Student_Name : sname,
      Award : award,
      Awarding_government : ag,
      Year_of_Award : yearOfAward,
      Department_1 : dept1,
      Academic_Year1 : ay1
    };

    axios.post('http://localhost:3001/createUser', newUser)
      .then((response) => {
        console.log(response);
        // Update the state with the new user
        setUsers([...users, newUser]);
        // Reset input fields
        setSname('');
        setAward('');
        setAg('');
        setYearOfAward('');
        setDept1('');
        setAy1('');
        window.alert('Data submitted successfully!');
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='project4-container'>
      <br />
      
      <div className="form-input">
        <label>Student Name</label>
        <input type="text" value={sname} onChange={(e) => setSname(e.target.value)} required/>
      </div>

      <div className="form-input">
        <label>Name of the Award</label>
        <select value={award} onChange={(e) => setAward(e.target.value)} style={{  width: '402px',  height: '45px', }} required>
        <option value=""></option>
          <option value="Flutter workshop(stepcone)">Flutter workshop(stepcone)</option>
          <option value="SPL-Cricket(District Winner)">SPL-Cricket(District Winner)</option>
          <option value="Workshop on Dart programming language">Workshop on Dart programming language</option>
          <option value="ANGULAR JS TO DEVELOP WEB APPS FASTER">ANGULAR JS TO DEVELOP WEB APPS FASTER</option>
          <option value="Cross Country (Youth Fest)">Cross Country (Youth Fest)</option>
          <option value="12th Edition Eenadu Champion Cricket Cup 2018">12th Edition Eenadu Champion Cricket Cup 2018</option>
          <option value="The Snaps Club Online Photography League">The Snaps Club Online Photography League</option>
          <option value="NSS Special Camp Programme">NSS Special Camp Programme</option>
        </select>
      </div>

      <div className="form-input">
        <label>Awarding Government</label>
        <input type="text" value={ag} onChange={(e) => setAg(e.target.value)} required/>
      </div>

      <div className="form-input">
        <label>Year Of Award</label>
        <select value={yearOfAward} onChange={(e) => setYearOfAward(e.target.value)} style={{ width: '402px' ,height:'45px' }} required>
        <option value=""></option>
          <option value="2022-2023">2022 - 2023</option>
          <option value="2021-2022">2021 - 2022</option>
          <option value="2020-2021">2020 - 2021</option>
          <option value="2019-2020">2019 - 2020</option>
          <option value="2018-2019">2018 - 2019</option>
        </select>
      </div>

      <div className="form-input">
        <label>Department</label>
        <select className='custom-dropdown'  value={dept1} onChange={(e) => setDept1(e.target.value)} style={{ width: '402px'  ,height:'45px'}} required>
        <option value=""></option>
          <option value="IT">IT</option>
          <option value="CSE">CSE</option>
        </select>
      </div>
      

      <div className="form-input">
        <label>Academic Year</label>
        <select value={ay1} onChange={(e) => setAy1(e.target.value)} style={{ width: '402px' ,height:'45px' }} required>
        <option value=""></option>
          <option value="2019-2020">2019 - 2020</option>
          <option value="2020-2021">2020 - 2021</option>
          <option value="2021-2022">2021 - 2022</option>
          <option value="2022-2023">2022 - 2023</option>
          <option value="2023-2024">2023 - 2024</option>
        </select>
        <button onClick={handleSubmit}>Upload Data</button>
      </div>

      
    </div>
  )
  
}

const Header = ({ setActiveProject, activeProject }) => (
  <header>
    <h1>Student Activities Management System</h1>
    <div className='nav-div'>
      <div className={`nav-child ${activeProject === 'project3' ? 'active' : ''}`} onClick={() => setActiveProject('project3')}>
        Internship Data filling
      </div>
      <div className={`nav-child ${activeProject === 'project1' ? 'active' : ''}`} onClick={() => setActiveProject('project1')}>
        Internship
      </div>

      <div className={`nav-child ${activeProject === 'project4' ? 'active' : ''}`} onClick={() => setActiveProject('project4')}>
        Workshop Data Filling
      </div>

      <div className={`nav-child ${activeProject === 'project2' ? 'active' : ''}`} onClick={() => setActiveProject('project2')}>
        Workshop
      </div>
    </div>
  </header>
);

Header.propTypes = {
  setActiveProject: PropTypes.func.isRequired,
  activeProject: PropTypes.string.isRequired // Adding prop type validation for activeProject
};


Header.propTypes = {
  setActiveProject: PropTypes.func.isRequired
};

function App() {
  const [activeProject, setActiveProject] = useState('project3');

  return (
    <div>
      <Header setActiveProject={setActiveProject} activeProject={activeProject} />
      {activeProject === 'project1' ? <Project1 /> : null}
      {activeProject === 'project2' ? <Project2 /> : null}
      {activeProject === 'project3' ? <Project3 /> : null}
      {activeProject === 'project4' ? <Project4 /> : null}
    </div>
  );
}

export default App;
