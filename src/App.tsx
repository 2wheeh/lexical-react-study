import { Editor } from './components/Editor';
import './styles/global.css';

function App() {
  return (
    <div className='max-w-4xl mx-auto my-16'>
      <p className='text-3xl font-serif'>lexical-react-study</p>
      <Editor />
    </div>
  );
}

export default App;
