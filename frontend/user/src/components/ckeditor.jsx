import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';
import '../App.css';

const LICENSE_KEY =
    'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjQ4MDYzOTksImp0aSI6IjlkYWY2NjA2LTRlOTUtNGUzNi05OGJiLTA4OTY5NTY4OGM2YSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiXSwiZmVhdHVyZXMiOlsiRFJVUCIsIkJPWCJdLCJ2YyI6IjFjM2UxNTU3In0.PE8F54iTOGEXBd0843fjJq-93XhEOpASNppI3curVa4gx9xMyfKGF_QDY_iDRM2nD9_PrfRfSZYF-1ko7Wnvbw';

// Lớp Upload Adapter tùy chỉnh
class Base64UploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    // Bắt đầu quá trình tải lên
    upload() {
        return this.loader.file
            .then(file => new Promise((resolve, reject) => {
                // Kiểm tra kích thước tập tin (ví dụ: giới hạn 5MB)
                const maxFileSize = 5 * 1024 * 1024; // 5MB
                if (file.size > maxFileSize) {
                    return reject(`Kích thước tập tin quá lớn. Tối đa ${maxFileSize / (1024 * 1024)}MB.`);
                }

                // Kiểm tra loại tập tin
                const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml'];
                if (!acceptedTypes.includes(file.type)) {
                    return reject('Loại tập tin không được hỗ trợ. Chỉ chấp nhận JPG, PNG, GIF, BMP, WEBP và SVG.');
                }

                // Sử dụng FileReader để đọc tệp dưới dạng URL dữ liệu
                const reader = new FileReader();
                
                reader.onload = function() {
                    resolve({
                        default: reader.result
                    });
                };
                
                reader.onerror = function() {
                    reject('Không thể đọc tập tin. Vui lòng thử lại.');
                };
                
                reader.onabort = function() {
                    reject('Việc đọc tập tin đã bị hủy.');
                };
                
                reader.readAsDataURL(file);
            }));
    }

    // Hủy quá trình tải lên
    abort() {
        // Không cần thực hiện gì trong trường hợp này vì FileReader không hỗ trợ abort
        console.log('Đã hủy quá trình tải lên.');
    }
}

// Hàm tạo plugin tạo một thể hiện mới của adapter
function Base64UploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new Base64UploadAdapter(loader);
    };
}

export const Ckeditor5Component = ({ dataEditor, onChange }) => {
    const [contentData, setContentData] = useState('');
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    const [editor, setEditor] = useState(null);
    const cloud = useCKEditorCloud({ version: '44.1.0', translations: ['vi'] });

    // Cập nhật contentData khi dataEditor thay đổi
    useEffect(() => {
        if (dataEditor) {
            setContentData(dataEditor);
            // Nếu editor đã được khởi tạo, cập nhật nội dung trực tiếp
            if (editor) {
                editor.setData(dataEditor);
            }
        }
    }, [dataEditor, editor]);

    // Xử lý khi editor sẵn sàng
    const handleEditorReady = useCallback((editor) => {
        setEditor(editor);
        
        // Đăng ký xử lý lỗi tải lên
        editor.plugins.get('FileRepository').on('uploadError', (evt, { error, fileLoader }) => {
            console.error('Upload error:', error);
            // Hiển thị thông báo lỗi cho người dùng (có thể thêm thư viện toast hoặc alert)
            alert(`Lỗi tải lên: ${error.message || 'Không thể tải lên hình ảnh'}`);
        });
    }, []);

    // Xử lý khi nội dung thay đổi
    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setContentData(data);
        if (onChange) onChange(data);
    };

    // Thiết lập layout
    useEffect(() => {
        setIsLayoutReady(true);
        return () => setIsLayoutReady(false);
    }, []);

    // Làm sạch khi component unmount
    useEffect(() => {
        return () => {
            if (editor) {
                editor.destroy()
                    .catch(error => {
                        console.error('Lỗi khi hủy editor:', error);
                    });
            }
        };
    }, [editor]);

    const { ClassicEditor, editorConfig } = useMemo(() => {
        if (cloud.status !== 'success' || !isLayoutReady) {
            return {};
        }

        const {
            ClassicEditor,
            Alignment,
            AutoImage,
            Autosave,
            BalloonToolbar,
            BlockQuote,
            Bold,
            CloudServices,
            Code,
            Essentials,
            FontBackgroundColor,
            FontColor,
            FontFamily,
            FontSize,
            Heading,
            Highlight,
            ImageBlock,
            ImageCaption,
            ImageInline,
            ImageInsertViaUrl,
            ImageResize,
            ImageStyle,
            ImageTextAlternative,
            ImageToolbar,
            ImageUpload,
            Indent,
            IndentBlock,
            Italic,
            Link,
            LinkImage,
            List,
            ListProperties,
            Paragraph,
            RemoveFormat,
            SpecialCharacters,
            Strikethrough,
            Subscript,
            Superscript,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableProperties,
            TableToolbar,
            TodoList,
            Underline
        } = cloud.CKEditor;

        return {
            ClassicEditor,
            editorConfig: {
                toolbar: {
                    items: [
                        'heading',
                        '|',
                        'fontSize',
                        'fontFamily',
                        'fontColor',
                        'fontBackgroundColor',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        '|',
                        'link',
                        'insertTable',
                        'highlight',
                        'blockQuote',
                        '|',
                        'alignment',
                        '|',
                        'bulletedList',
                        'numberedList',
                        'todoList',
                        'outdent',
                        'indent',
                        '|',
                        'imageUpload',  // Đảm bảo có mục này trong thanh công cụ
                        'imageInsertViaUrl'
                    ],
                    shouldNotGroupWhenFull: false
                },
                extraPlugins: [Base64UploadAdapterPlugin], // Thêm plugin adapter tùy chỉnh của bạn
                plugins: [
                    Alignment,
                    AutoImage,
                    Autosave,
                    BalloonToolbar,
                    BlockQuote,
                    Bold,
                    CloudServices,
                    Code,
                    Essentials,
                    FontBackgroundColor,
                    FontColor,
                    FontFamily,
                    FontSize,
                    Heading,
                    Highlight,
                    ImageBlock,
                    ImageCaption,
                    ImageInline,
                    ImageInsertViaUrl,
                    ImageResize,
                    ImageStyle,
                    ImageTextAlternative,
                    ImageToolbar,
                    ImageUpload,
                    Indent,
                    IndentBlock,
                    Italic,
                    Link,
                    LinkImage,
                    List,
                    ListProperties,
                    Paragraph,
                    RemoveFormat,
                    SpecialCharacters,
                    Strikethrough,
                    Subscript,
                    Superscript,
                    Table,
                    TableCaption,
                    TableCellProperties,
                    TableColumnResize,
                    TableProperties,
                    TableToolbar,
                    TodoList,
                    Underline
                ],
                balloonToolbar: ['bold', 'italic', '|', 'link', '|', 'bulletedList', 'numberedList'],
                fontFamily: {
                    supportAllValues: true
                },
                fontSize: {
                    options: [10, 12, 14, 'default', 18, 20, 22],
                    supportAllValues: true
                },
                heading: {
                    options: [
                        {
                            model: 'paragraph',
                            title: 'Paragraph',
                            class: 'ck-heading_paragraph'
                        },
                        {
                            model: 'heading1',
                            view: 'h1',
                            title: 'Heading 1',
                            class: 'ck-heading_heading1'
                        },
                        {
                            model: 'heading2',
                            view: 'h2',
                            title: 'Heading 2',
                            class: 'ck-heading_heading2'
                        },
                        {
                            model: 'heading3',
                            view: 'h3',
                            title: 'Heading 3',
                            class: 'ck-heading_heading3'
                        },
                        {
                            model: 'heading4',
                            view: 'h4',
                            title: 'Heading 4',
                            class: 'ck-heading_heading4'
                        },
                        {
                            model: 'heading5',
                            view: 'h5',
                            title: 'Heading 5',
                            class: 'ck-heading_heading5'
                        },
                        {
                            model: 'heading6',
                            view: 'h6',
                            title: 'Heading 6',
                            class: 'ck-heading_heading6'
                        }
                    ]
                },
                image: {
                    toolbar: [
                        'toggleImageCaption',
                        'imageTextAlternative',
                        '|',
                        'imageStyle:inline',
                        'imageStyle:wrapText',
                        'imageStyle:breakText',
                        '|',
                        'resizeImage'
                    ],
                    upload: {
                        types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'svg+xml']
                    }
                },
                initialData: contentData,
                language: 'vi',
                licenseKey: LICENSE_KEY,
                link: {
                    addTargetToExternalLinks: true,
                    defaultProtocol: 'https://',
                    decorators: {
                        toggleDownloadable: {
                            mode: 'manual',
                            label: 'Downloadable',
                            attributes: {
                                download: 'file'
                            }
                        }
                    }
                },
                list: {
                    properties: {
                        styles: true,
                        startIndex: true,
                        reversed: true
                    }
                },
                menuBar: {
                    isVisible: true
                },
                placeholder: 'Nhập hoặc dán nội dung của bạn tại đây!',
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
                },
                // Thêm giới hạn kích thước tệp
                fileUpload: {
                    maxFileSize: 5 * 1024 * 1024 // 5MB
                }
            }
        };
    }, [cloud, isLayoutReady, contentData]);

    // Hiển thị trạng thái đang tải nếu cloud chưa sẵn sàng
    if (cloud.status === 'loading') {
        return <div className="editor-loading">Đang tải trình soạn thảo...</div>;
    }

    // Hiển thị lỗi nếu có
    if (cloud.status === 'error') {
        return <div className="editor-error">Không thể tải trình soạn thảo. Vui lòng thử lại sau.</div>;
    }

    return (
        <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
            <div className="editor-container__editor">
                <div ref={editorRef}>{
                    ClassicEditor && editorConfig &&
                    <CKEditor
                        editor={ClassicEditor}
                        config={editorConfig}
                        data={contentData}
                        onChange={handleEditorChange}
                        onReady={handleEditorReady}
                    />}</div>
            </div>
        </div>
    );
};