import { useState, useEffect } from "react";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";

// Get the editor type from @lexical/html for casting
import type { LexicalEditor as HtmlLexicalEditor } from "@lexical/html/node_modules/lexical";

interface Props {
    initialHtml?: string;
    onHtmlChanged: (html: string) => void;
}

const HtmlPlugin = ({ initialHtml, onHtmlChanged }: Props) => {
    const [editor] = useLexicalComposerContext();
    const [isFirstRender, setIsFirstRender] = useState(true);
    
    useEffect(() => {
        if (initialHtml === '') {
            editor.update(() => {
                $getRoot().clear();
            });
        }
        if (isFirstRender && initialHtml != undefined && initialHtml !== '') {
            setIsFirstRender(false);
            
            // Simple HTML parsing - for complex HTML you might need a more robust solution
            editor.update(() => {
                try {
                    // Clear the editor first
                    $getRoot().clear();
                    
                    // Create a simple paragraph with the HTML content
                    // This is a basic implementation - for complex HTML you'd need more parsing
                    const paragraphNode = $createParagraphNode();
                    const textNode = $createTextNode(initialHtml);
                    paragraphNode.append(textNode);
                    $getRoot().append(paragraphNode);
                } catch (error) {
                    console.error('Error initializing editor with HTML:', error);
                }
            });
        }
    }, [isFirstRender, initialHtml, editor]);

    // Function to get HTML content directly from the DOM
    const getHtmlContent = () => {
        // Get the editor's DOM element
        const editorElement = editor.getRootElement();
        if (!editorElement) return '';
        
        // Return its inner HTML
        return editorElement.innerHTML;
    };

    return (
        <OnChangePlugin
            onChange={() => {
                // Get HTML directly from the DOM instead of using the incompatible libraries
                const html = getHtmlContent();
                if (html && html !== '') {
                    onHtmlChanged(html);
                }
            }}
        />
    );
};

export default HtmlPlugin;