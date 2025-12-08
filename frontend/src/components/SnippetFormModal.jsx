import { useState } from 'react';

const SnippetFormModal = ({ snippet, onClose, onSave, mode = 'create' }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(() => {
        if (snippet && mode === 'edit') {
            return {
                title: snippet.title,
                code: snippet.code,
                language: snippet.language,
                style: snippet.style,
                linenos: snippet.linenos
            };
        }
        return {
            title: '',
            code: '',
            language: 'python',
            style: 'friendly',
            linenos: false
        };
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error('Failed to save snippet:', error);
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{maxWidth: '600px'}}>
                <div className="modal-header">
                    <h2>{mode === 'create' ? 'New Snippet' : 'Edit Snippet'}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="Snippet Title" />
                    </div>
                    <div className="form-group">
                        <label>Code</label>
                        <textarea
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            rows={10}
                            required
                            placeholder="Paste your code here..."
                            style={{fontFamily: 'monospace'}}
                        />
                    </div>
                    <div style={{display:'flex', gap:'20px'}}>
                        <div className="form-group" style={{flex:1}}>
                            <label>Language</label>
                            <select name="language" value={formData.language} onChange={handleChange}>
                                <option value="python">Python</option>
                                <option value="javascript">JavaScript</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                                <option value="html">HTML</option>
                                <option value="css">CSS</option>
                                <option value="sql">SQL</option>
                                <option value="php">PHP</option>
                                <option value="ruby">Ruby</option>
                                <option value="go">Go</option>
                                <option value="rust">Rust</option>
                                <option value="swift">Swift</option>
                                <option value="kotlin">Kotlin</option>
                                <option value="typescript">TypeScript</option>
                            </select>
                        </div>
                        <div className="form-group" style={{flex:1}}>
                            <label>Style</label>
                            <select name="style" value={formData.style} onChange={handleChange}>
                                <option value="friendly">Friendly</option>
                                <option value="colorful">Colorful</option>
                                <option value="monokai">Monokai</option>
                                <option value="paraiso">Paraiso</option>
                                <option value="qtcreator">Qt Creator</option>
                                <option value="stackoverflow">Stackoverflow</option>
                                <option value="vs">VS</option>
                                <option value="xonokai">Xonokai</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="linenos"
                                checked={formData.linenos}
                                onChange={handleChange}
                            /> Show Line Numbers
                        </label>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>{mode === 'create' ? 'Create' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SnippetFormModal;
