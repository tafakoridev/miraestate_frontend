import { useState } from "react";

interface Category {
  id: number;
  title: string;
  price: string;
  parent_id: number | null;
  children?: Category[];
}

interface TreeProps {
  categories: Category[];
  handleNodeClick: Function;
}
interface Category {
  id: number;
  title: string;
  price: string;
  parent_id: number | null;
  recursive_children?: Category[];
}

interface TreeNodeProps {
  category: Category;
  onNodeClick: Function;
}

const TreeNode: React.FC<TreeNodeProps> = ({ category, onNodeClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div className="flex items-center space-x-2 bg-gray-200 my-1 rounded-md p-1">
        {category.recursive_children?.length != 0 && (
          <button onClick={handleToggle} className="text-blue-500 text-lg font-bold mx-2">
            {isExpanded ? "-" : "+"}
          </button>
        )}
        <span
          onClick={() => onNodeClick(category.id)}
          className="cursor-pointer"
        >
          {category.title}
        </span>
      </div>

      {isExpanded && category.recursive_children && (
        <div className="pr-4">
          {category.recursive_children.map((child) => (
            <TreeNode
              key={child.id}
              category={child}
              onNodeClick={onNodeClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Tree: React.FC<TreeProps> = ({ categories, handleNodeClick }) => {
  

  return (
    <div>
      {categories.map((category) => (
        <TreeNode
          key={category.id}
          category={category}
          onNodeClick={handleNodeClick}
        />
      ))}
    </div>
  );
};

export default Tree;
