import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { SkillTrade } from './routes/skills';
import { NavBar } from './routes/navbar';
import { RecoilRoot } from 'recoil';
import { SignIn } from './routes/signin';
import { SignUp } from './routes/signup';
import { Service } from './routes/service';
import { CreateService } from './routes/createService';
import { ServiceDesc } from './routes/ServiceDesc';
import { TeachService } from './routes/teachRequest';
import { TradeService } from './routes/tradeRequest';
import { Notifications } from './routes/notifications';
import Meeting from './routes/CreateMeeting';
import { JoinMeeting } from './routes/joinMeeting';

function App() {
  return (
    <RecoilRoot>
      <div className="h-screen">
        <BrowserRouter>
          <NavBarWithConditional />
          <Routes>
            <Route path="/create" element={<CreateService />} />
            <Route path="/teachrequest" element={<TeachService />} />
            <Route path="/traderequest" element={<TradeService />} />
            <Route path="/create/description" element={<ServiceDesc />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/skills" element={<SkillTrade />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/skills/:id" element={<Service />} />
            <Route path="/video" element={<Meeting />} />
            <Route path="/video/join/:id" element={<JoinMeeting />} />
            
          </Routes>
        </BrowserRouter>
      </div>
    </RecoilRoot>
  );
}

function NavBarWithConditional() {
  const location = useLocation();

  return (
    <>
      {/* Conditionally render NavBar based on the route */}
      {location.pathname !== '/signin' && location.pathname !== '/signup' && <NavBar />}
    </>
  );
}

export default App;
