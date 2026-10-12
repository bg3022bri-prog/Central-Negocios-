import os
import zipfile

EXCLUDE_DIRS = {
    'node_modules',
    '.git',
    'dist',
    'build',
    '.cache',
    '__pycache__',
}

EXCLUDE_FILES = {
    'centralnegocio-codigo-completo.zip',
}

def create_project_zip(output_path):
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(root_dir):
            # Prune excluded directories
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            
            for file in files:
                if file in EXCLUDE_FILES:
                    continue
                # Also exclude .zip files in root or public
                if file.endswith('.zip') or file.endswith('.tar.gz'):
                    continue
                    
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, root_dir)
                zipf.write(full_path, rel_path)
                
    print(f"Zip created successfully at: {output_path}")
    print(f"File size: {os.path.getsize(output_path) / 1024:.2f} KB")

if __name__ == '__main__':
    target = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'public', 'centralnegocio-codigo-completo.zip'))
    create_project_zip(target)
