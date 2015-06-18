var TableComponent = React.createClass({displayName: "TableComponent",

    getInitialState: function () {
        return {
            data: [],
            sortDir: {}
        };
    },

    componentDidMount: function () {
        $.getJSON(this.props.src, {
            format: "json"
        }).done(function (data) {

            if (this.isMounted()) {
                this.setState({
                    data: data
                });
            }
        }.bind(this));
    },

    getColumnNames: function () {
        if (this.isMounted()) {
            var firstEl = this.state.data[0];
            return Object.keys(firstEl);
        }
    },

    sortByColumn: function (array, column, sortDir) {
        return array.sort(function (a, b) {
            var x = a[column];
            var y = b[column];
            if (sortDir === 'asc') {
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            } else {
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }
        });
    },

    sort: function (column) {
        var sortDir = this.state.sortDir;
        var data = this.state.data;
        var sortedData = this.sortByColumn(data, column, sortDir[column]);
        this.setState({data: sortedData});
        sortDir[column] = (sortDir[column] === 'asc' ? 'dsc' : 'asc');
        this.setState({sortDir: sortDir});
        this.props.caption += ' Sorted By ' + ' ' + column + ' ' + sortDir;
    },

    render: function () {
        var columns = this.getColumnNames();
        var data = this.state.data;

        if (this.isMounted()) {
            return (
                React.createElement("table", null, 
                    React.createElement(TableCaption, {caption: this.props.caption, onSort: this.sort}), 
                    React.createElement("thead", null, 
                        React.createElement(TableHeader, {onSort: this.sort, columns: columns})
                    ), 
                    React.createElement(TableBody, {data: data, columns: columns})
                )
            )
        } else {
            return (
                React.createElement("table", null)
            )
        }
    }
});


var TableHeader = React.createClass({displayName: "TableHeader",
    sort: function (column) {
        return function (event) {

            var code = event.charCode || event.keyCode,
                type = event.type;

            if (type === 'keydown') {
                var ENTER = 13,
                    SPACE = 32;

                if ((code !== ENTER) && (code !== SPACE)) {
                    event.stopPropagation();
                }
                else if (code === SPACE) {
                    event.preventDefault();
                }
            }

            var sortDir = this.props.sortDir;
            console.log(sortDir);
            console.log(column);
            this.props.onSort(column, sortDir);
        }.bind(this);
    },

    render: function () {
        var columns = this.props.columns;
        var cell = function () {
            return columns.map(function (c, i) {
                return React.createElement("th", {scope: "col", tabIndex: "0", role: "columnheader", onKeyDown: this.sort(c), onClick: this.sort(c), key: c}, c);
            }, this);
        }.bind(this);


        return (
            React.createElement("tr", {key: "headerRow"},  cell(this.props.item) )
        )
    }
});

var TableCaption = React.createClass({displayName: "TableCaption",

    render: function () {

        return (
            React.createElement("caption", {role: "status", "aria-live": "assertive", "aria-relevant": "all", "aria-atomic": "true"}, this.props.caption)
        )
    }
});


var TableBody = React.createClass({displayName: "TableBody",
    render: function () {
        var columns = this.props.columns;
        var data = this.props.data;

        return (
            React.createElement("tbody", null, 
        data.map(function (item, idx) {
            return React.createElement(TableRow, {key: idx, data: item, columns: columns});
        })
            )
        )
    }
});


var TableRow = React.createClass({displayName: "TableRow",
    render: function () {
        var columns = this.props.columns;
        var data = this.props.data;
        var td = function (item) {

            return columns.map(function (c, i) {



                return React.createElement("td", {key: i}, item[c]);
            }, this);
        }.bind(this);

        return (
            React.createElement("tr", {key: data},  td(data) )
        )
    }
});


React.render(
    React.createElement(TableComponent, {caption: "Foo", src: "./data/data.json"}), document.getElementById('table')
)
