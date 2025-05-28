import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProjectForm } from '@/components/form/ProjectForm';
import { ProjectList } from '@/components/ProjectList';
import { useProjects } from '@/hooks/useProjects';

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { projects, isLoading, isError } = useProjects();

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (isError) {
    return <div>Error fetching projects.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Project Manager</h1>
          <div className="flex gap-2">
            <Link to="/generate-sketch">
              <Button variant="outline">
                Generate Sketch
              </Button>
            </Link>
            <Button onClick={() => setIsFormOpen(true)}>
              Add New Project
            </Button>
          </div>
        </div>

        {/* Project List */}
        <ProjectList projects={projects} />

        {/* Project Form Modal */}
        <ProjectForm open={isFormOpen} setOpen={setIsFormOpen} />
      </div>
    </div>
  );
};

export default Index;
